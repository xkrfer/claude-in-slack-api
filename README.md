# claude-in-slack-api
Convert claude to chatgpt form api through Slack

## Conversion Details
Use the Slack API to send messages to Claude and receive his replies through the Slack API. Then, format the replies in the format of the chatgpt interface and return them to the user, allowing Claude to be used on any platform that supports the chatgpt API.

## How to use
### 1. GET Slack User Token and Bot ID
[Claude｜媲美ChatGPT，如何免费接入到个人服务](https://mp.weixin.qq.com/s?__biz=Mzg4MjkzMzc1Mg==&mid=2247483961&idx=1&sn=c009f4ea28287daeaa4de17278c8228e&chksm=cf4e68aef839e1b8fe49110341e2a557e0b118fee82d490143656a12c7f85bdd4ef6f65ffd16&token=1094126126&lang=zh_CN#rd)

### 2. Run
1. Create a "config" directory in the current directory and add an ".env" file, then fill it with the following content:
    ```.env
    # .env
    CLAUDE_BOT_ID=your_CLAUDE_BOT_ID
    SLACK_USER_TOKEN=your_SLACK_USER_TOKEN
    TOKEN=your_TOKEN # any string you like
    SPLIT_STREAM=true # whether to split the stream, if false will return all the results at once
    ```
2. Run
    ```bash
    docker run -p 9000:9000 \
         -d --restart=always \
         --volume ./config:/config \
         --name claude-api \
         xkrfer/claude-in-slack-api
    ```
3. Test
    ```bash
   curl --location 'http://127.0.0.1:9000/v1/chat/completions' \
      --header 'Content-Type: application/json' \
      --header 'Authorization: Bearer token' \
      --data '{
      "model": "gpt-3.5-turbo",
      "messages": [
         {
         "role": "user",
         "content": "hello"
         }
      ],
      "max_tokens": 100,
      "temperature": 1,
      "stream": true
   }'
    ```

4. If you need to reverse proxy using Nginx, you will need to add the following content to your Nginx configuration file:
    ```conf
    location /
    {
        proxy_pass http://127.0.0.1:9000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header REMOTE-HOST $remote_addr;
        # support sse
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        chunked_transfer_encoding off;
        proxy_buffering off;
        proxy_cache off;
        proxy_redirect off;
        proxy_hide_header Cache-Control;
    }
    ```
5. Open [https://web.chatboxapp.xyz](https://web.chatboxapp.xyz/) and enter the address of your server, then you can chat with Claude.
   ![img](https://telegraph-image-pages.pages.dev/file/989383790f105834ea787.png)

## Pay attention to
Convert this service to HTTPS in order to avoid potential errors that may arise on other tools.

## Thanks
[yokonsan/claude-in-slack-api](https://github.com/yokonsan/claude-in-slack-api)    
[jtsang4/claude-to-chatgpt](https://github.com/jtsang4/claude-to-chatgpt)   
[Bin-Huang/chatbox](https://github.com/Bin-Huang/chatbox)
[如何通过Dockerfile优化Nestjs镜像大小](https://juejin.cn/post/7132533610707419173)
