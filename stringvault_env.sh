#!/bin/bash
# StringVault Conda环境激活脚本
# 用于supervisor启动StringVault应用

# 设置conda路径
CONDA_PATH="/home/liuxl/miniconda3"
CONDA_ENV="base"

# 激活conda环境
source $CONDA_PATH/etc/profile.d/conda.sh
conda activate $CONDA_ENV

# 设置环境变量
export FLASK_CONFIG="production"
export SECRET_KEY="your-very-secret-key-here-change-this"
export FLASK_APP="run.py"
export PYTHONPATH="/home/liuxl/StringVault"

# 进入项目目录
cd /home/liuxl/StringVault

# 执行传入的命令
exec "$@"
