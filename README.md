# ブログアプリ

Supabase と Next.js で作られたモダンなブログアプリケーションです。

## 🚀 特徴

- **認証システム**: Supabase Authを使用したセキュアな認証
- **CRUD操作**: ブログ記事の作成、読み取り、更新、削除
- **公開/下書き**: 記事のステータス管理
- **レスポンシブデザイン**: Tailwind CSSによるモバイルファーストデザイン
- **型安全性**: TypeScriptによる厳格な型チェック
- **セキュリティ**: Row Level Security (RLS) による安全なデータアクセス

## 🛠️ 技術スタック

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Authentication, RLS)
- **Form Management**: React Hook Form + Zod
- **Deployment**: Vercel

## 📋 セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. Supabaseプロジェクトの設定

1. [Supabase](https://supabase.com) でプロジェクトを作成
2. SQL Editorで `supabase-setup.sql` の内容を実行
3. プロジェクトのURLとAPIキーを取得

### 3. 環境変数の設定

`.env.local` ファイルを作成：

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

## 📖 使い方

1. **アカウント作成**: サインアップページでアカウントを作成
2. **メール確認**: 送信された確認メールをクリック
3. **ログイン**: サインインページでログイン
4. **記事作成**: ダッシュボードから新規投稿を作成
5. **記事管理**: 公開/下書きの切り替え、編集、削除が可能

## 🗄️ データベース構造

### profiles テーブル
- id (UUID, Primary Key)
- email (TEXT)
- full_name (TEXT)
- avatar_url (TEXT)
- created_at, updated_at (TIMESTAMP)

### posts テーブル
- id (UUID, Primary Key)
- title (TEXT)
- content (TEXT)
- excerpt (TEXT)
- slug (TEXT, Unique)
- published (BOOLEAN)
- created_at, updated_at (TIMESTAMP)
- author_id (UUID, Foreign Key)

## 🚀 デプロイ

### Vercelでのデプロイ

1. Vercelアカウントでプロジェクトをインポート
2. 環境変数を設定：
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. デプロイを実行

## 💰 コスト

このアプリケーションは無料プランで運用可能：

- **Supabase**: 無料プラン（50MB DB, 50,000 API calls/月）
- **Vercel**: 無料プラン（100GB bandwidth/月）
- **ドメイン**: 約1,000円/年（オプション）

## 🔒 セキュリティ

- Row Level Security (RLS) によるデータ保護
- ユーザーは自分のデータのみアクセス可能
- 公開記事のみ一般ユーザーが閲覧可能

## 📝 ライセンス

MIT License
