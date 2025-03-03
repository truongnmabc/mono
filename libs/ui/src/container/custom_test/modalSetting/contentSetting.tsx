import CloseIcon from "@/asset/icon/CloseIcon";
import { MtUiButton } from "@/components/button";
import { ITopicBase } from "@/models/topics/topicsProgress";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { IFeedBack } from ".";
import { CardFeeBack } from "./cardFeedBack";
import CardProgress from "./cardProgress";
import CardTopic from "./cardTopic";

type IFormState = {
    selectFeedback: IFeedBack;
    count: number;
    duration: number;
    passing: number;
    selectListTopic: ITopicBase[];
};

type IProps = {
    isShowBtnCancel: boolean;
    onCancel: () => void;
    listTopic: ITopicBase[];
    onUpdate: (data: IFormState) => Promise<void>;
    handleSelectAll: () => void;
    onStart: (data: IFormState) => Promise<void>;
    loading: boolean;
    isUpdate: boolean;
    defaultValues: IFormState;
};

// ✅ Schema validation với Yup
const schema = yup.object().shape({
    selectFeedback: yup.string().oneOf(["newbie", "expert", "exam"]).required(),
    count: yup.number().min(1, "Must be at least 1").max(100).required(),
    duration: yup
        .number()
        .min(1, "Must be at least 1 minute")
        .max(90)
        .required(),
    passing: yup.number().min(1).max(100).required(),
    selectListTopic: yup.array().min(1, "Select at least one topic").required(),
});

const ContentSetting: React.FC<IProps> = ({
    isShowBtnCancel,
    onCancel,
    listTopic,
    onUpdate,
    handleSelectAll,
    onStart,
    loading,
    isUpdate,
    defaultValues,
}) => {
    // ✅ Khởi tạo form với React Hook Form
    const {
        handleSubmit,
        control,
        watch,
        setValue,
        formState: { errors },
    } = useForm<IFormState>({
        resolver: yupResolver(schema),
        defaultValues,
    });

    const selectListTopic = watch("selectListTopic");
    const count = watch("count");

    return (
        <div className="w-full flex flex-col justify-between max-w-[900px] max-h-[790px] h-full p-4 sm:p-6 bg-theme-white">
            <div className="flex-1 overflow-y-auto scrollbar-none">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <p className="text-2xl text-center w-full sm:text-start font-semibold">
                        Customize Your Test
                    </p>
                    {isShowBtnCancel && (
                        <button
                            aria-label="Close"
                            onClick={onCancel}
                            className="w-8 h-8 cursor-pointer rounded-full bg-white flex items-center justify-center"
                        >
                            <CloseIcon />
                        </button>
                    )}
                </div>

                {/* Feedback Modes */}
                <section className="mt-6">
                    <p className="text-lg font-semibold">Feedback Modes</p>
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {["newbie", "expert", "exam"].map((type) => (
                            <Controller
                                key={type}
                                name="selectFeedback"
                                control={control}
                                render={({ field }) => (
                                    <CardFeeBack
                                        text={`${
                                            type.charAt(0).toUpperCase() +
                                            type.slice(1)
                                        } Mode`}
                                        type={type as IFeedBack}
                                        select={field.value}
                                        onSelect={field.onChange}
                                        des={
                                            type === "newbie"
                                                ? "Answers and explanations are displayed immediately after each question."
                                                : type === "expert"
                                                ? "Only answer accuracy is evaluated after each question. No explanation provided."
                                                : "The final score is shown after answering all questions."
                                        }
                                    />
                                )}
                            />
                        ))}
                    </div>
                </section>

                {/* Test Settings */}
                <section className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Controller
                        name="count"
                        control={control}
                        render={({ field }) => (
                            <CardProgress
                                title="Question Count:*"
                                max={100}
                                defaultValue={field.value}
                                changeProgress={field.onChange}
                            />
                        )}
                    />
                    <Controller
                        name="duration"
                        control={control}
                        render={({ field }) => (
                            <CardProgress
                                title="Duration:"
                                suffix="minutes"
                                max={90}
                                defaultValue={field.value}
                                changeProgress={field.onChange}
                            />
                        )}
                    />
                    <Controller
                        name="passing"
                        control={control}
                        render={({ field }) => (
                            <CardProgress
                                title="Passing Score:"
                                suffix="%"
                                max={100}
                                defaultValue={field.value}
                                changeProgress={field.onChange}
                            />
                        )}
                    />
                </section>

                {/* Topics Selection */}
                <section className="mt-6 pb-1">
                    <div className="flex items-center gap-3">
                        <p className="text-lg font-semibold">Subjects</p>
                        <button
                            aria-label="Select All Topics"
                            className="underline cursor-pointer text-sm font-normal"
                            onClick={handleSelectAll}
                        >
                            Select All
                        </button>
                    </div>
                    <div className="grid mt-4 gap-4 grid-cols-1 sm:grid-cols-3">
                        {listTopic.map((item) => (
                            <CardTopic
                                key={item.id}
                                item={item}
                                selectListTopic={selectListTopic}
                                setSelectListTopic={(newList) =>
                                    setValue("selectListTopic", newList)
                                }
                            />
                        ))}
                    </div>
                    {errors.selectListTopic && (
                        <p className="text-red-500 text-sm">
                            {errors.selectListTopic.message}
                        </p>
                    )}
                </section>
            </div>

            {/* Footer Buttons */}
            <div className="flex pb-6 sm:pb-0 w-full mt-6 items-center justify-end gap-4">
                {isShowBtnCancel && (
                    <MtUiButton
                        className="sm:max-w-32"
                        block
                        size="large"
                        onClick={onCancel}
                    >
                        Cancel
                    </MtUiButton>
                )}

                <MtUiButton
                    size="large"
                    type="primary"
                    block
                    onClick={handleSubmit(isUpdate ? onUpdate : onStart)}
                    disabled={count === 0 || selectListTopic.length === 0}
                    className="sm:max-w-32"
                    loading={loading}
                >
                    {isUpdate ? "Update" : "Start"}
                </MtUiButton>
            </div>
        </div>
    );
};

export default ContentSetting;
