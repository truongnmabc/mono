import { exec,execSync } from "child_process";
import fs from "fs";
import path from "path";
const args = process.argv.slice(2);

const command = args[0];
const option = args[1];
function deployCaprover(appName, redeploy = false) {
    const startTime = Date.now();

    console.log('Redeploy:', redeploy);

    // Define paths
    const envFile = './temp-env';
    const nextFile = './temp-next';
    const deployFile = './deploy.tar';

    try {
        // Remove .next if exists
        if (fs.existsSync('.next')) {
            fs.rmSync('.next', { recursive: true });
        }

        // Build the application
        execSync('yarn build', { stdio: 'inherit' });

        // Copy .next folder and env file
        fs.cpSync('.next', nextFile, { recursive: true });
        fs.copyFileSync('.env.local', envFile);

        // Remove cache from next folder
        if (fs.existsSync(path.join(nextFile, 'cache'))) {
            fs.rmSync(path.join(nextFile, 'cache'), { recursive: true });
        }

        // Create tar archive
        execSync(`tar -zcvf ${deployFile} --exclude='node_modules' --exclude='.next' --exclude='yarn.lock' ./*`, { stdio: 'inherit' });

        // Deploy using caprover
        if (redeploy) {
            execSync(`caprover deploy -t ${deployFile} -d`, { stdio: 'inherit' });
        } else {
            execSync(`caprover deploy -t ${deployFile}`, { stdio: 'inherit' });
        }

        // Cleanup temporary files
        fs.rmSync(envFile);
        fs.rmSync(nextFile, { recursive: true });
        fs.rmSync(deployFile);

        const endTime = Date.now();
        console.log(`It took ${(endTime - startTime) / 1000}s`);

    } catch (error) {
        console.error('Error during deployment:', error);
        throw error;
    }
}

// Sử dụng function
// deployCaprover('app-name', true); // Với redeploy
// deployCaprover('app-name'); // Không có redeploy

deployCaprover(command, option);
