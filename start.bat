@echo off
setlocal enabledelayedexpansion

:: 1. 卸载当前Docker容器
echo 正在停止并删除Docker容器...
docker compose down

:: 2. 清除容器关联卷
set /p formatVolumes=是否格式化卷？(y/n): 
if /i "!formatVolumes!"=="y" (
    echo 正在删除关联的Docker卷...
    docker compose down -v
)

:: 3. 删除容器镜像
echo 正在清理Docker镜像...
docker compose down --rmi all

:: 4. 启动Docker容器
echo 正在重建并启动容器...
docker compose up -d --build

endlocal