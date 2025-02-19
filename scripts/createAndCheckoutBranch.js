import { exec } from "child_process";
export const createAndCheckoutBranch = (branchName) => {
  if (!branchName) {
    process.exit(1);
  }

  const command = `git checkout -b ${branchName}`;

  exec(command, (error) => {
    if (error) {
      console.error(`Lỗi khi tạo nhánh mới: ${error.message}`);
      return;
    }
  });
};

