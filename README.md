# Railway中級編 Todoアプリをアップデートしよう

## 初期設定
### 必要なツール
1. Node.js v16以降
2. Yarn v1

このRailwayに取り組む方はすでにインストールできていると思いますがされていない方はインストールしてください。  
初期設定は原則HTML/CSS/JavaScript Railway, React.js Railwayと同様となります。

#### railway-todo-appリポジトリのFork
画面右上にあるForkより[railway-todo-app](https://github.com/TechBowl-japan/railway-todo-app)のリポジトリを自分のアカウントにForkしてください。

#### railway-todo-appリポジトリのClone
作成したリポジトリを作業するディレクトリにクローンしましょう。
- Macなら Terminal.app(iTerm2などでも良い)
- Windowsなら PowerShell(GitBashなどのインストールしたアプリでもう良いです。アプリによってはコマンドが異なることがあります)  
で作業するディレクトリを開き、次のコマンドでForkしたReact.js　Railwayのリポジトリをローカルにクローンしてください。

```powershell
git clone https://github.com/{GitHubのユーザー名}/railway-todo-app.git
```

SSHでクローンを行う場合には、次のようになります

```powershell
git clone git@github.com:[GitHubのユーザー名]/railway-todo-app.git
```

#### .envファイルの設定
クローンしたリポジトリには.env.sampleというファイルがあります。それをコピーしたものを.envにファイル名を変更してください。  
フォークして最初の状態ではAPIのURLを.envファイルから読み込むようになっています。それを自身の.envに追記してください。
APIのURLはTechTrainサービスにログインし、問題文の中で案内されているものを使用してください。

#### パッケージのインストール
クローンしたばかりのリポジトリは歯抜けの状態なので、必要なファイルをダウンロードする必要があります。 10 分程度掛かることもあるため、気長に待ちましょう。上から順番に __１つずつ__ コマンドを実行しましょう：

```powershell
cd railway-todo-app

yarn install
```

#### ローカルサーバの起動
以下コマンドを実行します。

```powershell
yarn start
```


//入れ子構造(ネスト)での記述簡略化
//変数が利用できる
・メインカラーなどを変数に入れておくことで保守性が上がる
//ミックスイン(mixin)が利用できる
・式を変数に入れて呼び出すみたいなことができる
https://itokoba.com/archives/2332
上記でメディアクエリの設定するときにすげー便利って書いてある
// ↓ボタンのスタイルを定義↓
@mixin button {
  display: inline-block;
  width: 300px;
  max-width: 100%;
  padding: 20px 10px;
  border: 2px solid transparent;
  box-shadow: 0 3px 6px rgba(0,0,0,.16);
  color: #fff;
  font-size: 18px;
  text-align: center;
  text-decoration: none;
  transition: .25s;
}
// ↑ボタンのスタイルを定義↑

.button01 {
  background-color: $main-color;
  @include button; //@includeでボタンのスタイルを呼び出す
}

.button01 {
  background-color: $sub-color;
  @include button; //@includeでボタンのスタイルを呼び出す
}


・命名規則なる変数の名前の付け方があるらしい、要勉強
