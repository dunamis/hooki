# hooki

This repository consists of front-end and back-end code for hooki project.

## 사전 작업 : nvm 설치
다음을 실행하면 자기 계정 디렉토리의 .nvm에 `nvm`이 설치되며, 재접속 이후 nvm 커맨드를 사용할 수 있게 된다.

    curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.25.4/install.sh | bash


아래 명령을 통하여 nodejs의 stable 버전을 설치한다.

    nvm install stable

stable 버전의 nodejs 사용 방법

    nvm use stable


버전 확인 방법


    node -v


.bashrc의 가장 아랫줄에 nvm use stable 을 넣어두면 매번 넣지 않아도 된다.

## 서버 실행 방법
우선 package.json에 정의된 모듈을 설치한다.

    $ npm install


서버는 다음과 같이 실행한다. 사용자마다 포트가 정의된다. (실행 후 메세지 확인)

    $ git clone git@github.com:dunamis/hooki.git
    $ cd hooki
    $ node server

위와 같이 `https`가 아니라 `ssh`로 clone을 받아야 매번 push할때마다 아이디 패스워드를 입력하지 않아도 된다. (공개키등록시)

## supervisor의 사용
`supervisor`를 이용하면 파일을 수정하는 즉시 반영되어 server가 재실행되어 편리하다.

    $ npm install -g supervisor
    $ cd hooki
    $ node server

-g를 이용하여 global 위치에 설치해도 `nvm` 사용시엔 각 유저 디렉토리에 설치되므로 관리가 편하다.

## 더미 데이터 생성 방법

    $ cd server/dev
    $ node mk_dummy

## node 모듈 추가
필요한 모듈 `npm install`으로 설치 후, pacakge.json 수정하는 방법이다.

    $ cd hooki/server
    $ npm init