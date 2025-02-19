self.importScripts("./idb.js");

self.addEventListener("install", (event) => {
    console.log("Service Worker installed.", event);
});

self.addEventListener("activate", (event) => {
    console.log("Service Worker activated.", event);
});

self.addEventListener("message", async (event) => {
    if (event.data.type === "INIT_DB") {
        const { appShortName, apiPath } = event.data.payload;
        console.log("start init db", new Date().toISOString());
        await handleInitData(appShortName, apiPath);
        console.log("end init db", new Date().toISOString());

        event.ports[0].postMessage({
            status: "success",
            message: "DB initialized and data fetched.",
        });
    }
});

async function initializeDBIdb(appShortName) {
    return await idb.openDB(appShortName, 10, {});
}

async function handleInitData(appShortName, apiPath) {
    const db = await initializeDBIdb(appShortName);
    try {
        const response = await fetch(
            `${apiPath.GET_DATA_STUDY}/${appShortName}`
        );
        const {
            data: { topic, tests },
        } = await response.json();

        const listTest = {
            finalTests: tests.finalTests?.slice(0, 1),
            practiceTests: tests.practiceTests,
        };

        await Promise.all([
            initDataTopics(topic, db, apiPath),
            initDataTest(listTest, db),
        ]);
    } catch (error) {
        console.error("Failed to fetch and initialize data:", error);
    }
}

const initDataTest = async (tests, db) => {
    const testTx = db.transaction("testQuestions", "readwrite");
    const testQuestionsStore = testTx.objectStore("testQuestions");

    const allTests = Object.values(tests).flat();

    const existingTests = await Promise.all(
        allTests.map((test) => testQuestionsStore.get(test.id))
    );

    const newTests = allTests.filter((_, index) => !existingTests[index]);

    await Promise.all(
        newTests.map((test) =>
            testQuestionsStore.add({
                id: test.id,
                totalDuration: test.duration,
                totalQuestion: test.totalQuestion,
                startTime: 0,
                gameMode: tests.finalTests.includes(test)
                    ? "finalTests"
                    : "practiceTests",
                status: 0,
                elapsedTime: 0,
                attemptNumber: 1,
                topicIds: test.topicIds,
                passingThreshold: test.passingPercent,
                groupExamData: test.groupExamData.flatMap((g) => g.examData),
                isGamePaused: false,
                createData: Date.now(),
            })
        )
    );

    await testTx.done;
};

const processQuestionsData = async (allQuestions, db) => {
    const questionTx = db.transaction("questions", "readwrite");
    const questionStore = questionTx.objectStore("questions");

    await Promise.all(
        allQuestions.map((question) => questionStore.put(question))
    );
    await questionTx.done;
};

const initDataTopics = async (topics, db, apiPath) => {
    await Promise.all(topics.map((topic) => processTopic(topic, db, apiPath)));
};

const processTopic = async (topic, db, apiPath) => {
    const topicId = Number(topic.id);
    if (await isTopicExists(topicId, db)) return;

    const data = await fetchTopicData(apiPath, topic.id);

    if (!data) return;

    const topicData = buildTopicData(topic, data);
    await saveTopicToDB(topicData, db);
    const allQuestions = extractAllQuestions(data, topic);
    await processQuestionsData(allQuestions, db);
};

const isTopicExists = async (topicId, db) => {
    const topicTx = db.transaction("topics", "readonly");
    const topicStore = topicTx.objectStore("topics");
    const exists = await topicStore.get(topicId);
    await topicTx.done;
    return exists;
};

const calculateTotalQuestionsTopic = (data) => {
    return data.reduce((total, topic) => {
        return (
            total +
            (topic.topics?.reduce(
                (sum, part) => sum + (part.questions?.length ?? 0),
                0
            ) || 0)
        );
    }, 0);
};

const buildTopicData = (topic, data) => {
    return {
        id: Number(topic.id),
        icon: topic.icon,
        tag: topic.tag,
        contentType: topic.contentType,
        name: topic.name,
        parentId: topic.parentId,
        topics: mapTopics(topic.topics, data),
        slug: `${topic.tag}-practice-test`,
        totalQuestion: calculateTotalQuestionsTopic(data),
        averageLevel: calculateAverageLevelTopic(data),
        status: 0,
        turn: 1,
    };
};

const calculateAverageLevelTopic = (data) => {
    let totalLevel = 0;
    let totalQuestions = 0;

    for (const topic of data) {
        for (const part of topic.topics || []) {
            for (const question of part.questions || []) {
                totalLevel += question.level === -1 ? 50 : question.level;
                totalQuestions += 1;
            }
        }
    }

    return totalQuestions > 0 ? totalLevel / totalQuestions : 0;
};

const saveTopicToDB = async (topicData, db) => {
    const topicTx = db.transaction("topics", "readwrite");
    const topicStore = topicTx.objectStore("topics");
    await topicStore.add(topicData);
    await topicTx.done;
};

const extractAllQuestions = (data, topic) => {
    return data.flatMap((t) => {
        const subTopicTag = t.tag;
        return (
            t.topics.flatMap((part) =>
                part.questions.map((item) => ({
                    icon: topic.icon,
                    tag: topic.tag,
                    subTopicTag,
                    status: 0,
                    appId: item.appId,
                    partId: part.id,
                    subTopicId: part.parentId,
                    topicId: t.parentId,
                    explanation: item.explanation,
                    id: item.id,
                    image: item.image,
                    level: item.level,
                    paragraphId: item.paragraphId,
                    paragraph: {
                        id: item?.paragraph?.id,
                        text: item?.paragraph?.text,
                    },
                    text: item.text,
                    answers: item.answers,
                }))
            ) || []
        );
    });
};

const mapSubTopics = (topics = [], data) =>
    topics.map(({ id, icon, tag, contentType, name, parentId }) => {
        const subTopicData = data.find((t) => Number(t.id) === id);
        const total = subTopicData?.questions?.length || 0;
        return {
            id: Number(id),
            icon,
            tag,
            contentType,
            name,
            parentId,
            slug: `${tag}-practice-test`,
            topics: [],
            status: 0,
            turn: 1,
            totalQuestion: total,
            averageLevel:
                (subTopicData?.questions?.reduce(
                    (sum, part) => sum + (part.level === -1 ? 50 : part.level),
                    0
                ) || 0) / total,
        };
    });

const mapTopics = (topics = [], data) =>
    topics.map(({ id, icon, tag, contentType, name, parentId, topics }) => {
        const topicData = data.find((t) => Number(t.id) === id);
        const total = calculateSubTopicTotalQuestions(topicData.topics);
        const averageLevel = calculateAverageLevel(topicData.topics);
        return {
            id: Number(id),
            icon,
            tag,
            contentType,
            name,
            parentId,
            slug: `${tag}-practice-test`,
            topics: mapSubTopics(topics, topicData.topics),
            totalQuestion: total,
            averageLevel: averageLevel / total,
            status: 0,
            turn: 1,
        };
    });

const fetchTopicData = async (apiPath, topicId) => {
    try {
        const response = await fetch(`${apiPath.GET_DATA_TOPICS}/${topicId}`);
        const result = await response.json();
        return result.data;
    } catch (error) {
        console.error(`❌ Lỗi khi fetch dữ liệu cho topic ${topicId}:`, error);
        return null;
    }
};

const calculateSubTopicTotalQuestions = (data) => {
    return (
        data?.reduce((sum, part) => sum + (part.questions?.length ?? 0), 0) || 0
    );
};

const calculateAverageLevel = (data) => {
    return data.reduce((total, topic) => {
        return (
            total +
            (topic.questions?.reduce(
                (sum, part) => sum + (part.level === -1 ? 50 : part.level),
                0
            ) || 0)
        );
    }, 0);
};
