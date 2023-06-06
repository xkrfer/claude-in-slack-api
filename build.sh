#!/bin/bash

# 定义变量
IMAGE_NAME="claude-in-slack-api"
IMAGE_TAG="latest"
DOCKERFILE_PATH="./Dockerfile"
CONTAINER_NAME="claude-in-slack-api-container"

# 构建镜像
docker build -t ${IMAGE_NAME}:${IMAGE_TAG} -f ${DOCKERFILE_PATH} .

# 检查容器是否存在
if docker ps -a --format '{{.Names}}' | grep -Eq "^${CONTAINER_NAME}\$"; then
  # 如果容器存在，则停止并删除它
  docker stop ${CONTAINER_NAME} && docker rm ${CONTAINER_NAME}
fi

# 运行新容器
docker run -d --name ${CONTAINER_NAME} -p 9000:9000 --volume ./config:/config ${IMAGE_NAME}:${IMAGE_TAG}
