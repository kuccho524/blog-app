-- プロファイルテーブルを作成
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ブログ投稿テーブルを作成
CREATE TABLE posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  slug TEXT UNIQUE NOT NULL,
  published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL
);

-- RLS（Row Level Security）を有効化
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- プロファイルのポリシー
CREATE POLICY "ユーザーは自分のプロファイルを閲覧可能" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "ユーザーは自分のプロファイルを更新可能" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "ユーザーは自分のプロファイルを作成可能" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 投稿のポリシー
CREATE POLICY "公開済み投稿は誰でも閲覧可能" ON posts
  FOR SELECT USING (published = true);

CREATE POLICY "ユーザーは自分の投稿を閲覧可能" ON posts
  FOR SELECT USING (auth.uid() = author_id);

CREATE POLICY "ユーザーは自分の投稿を作成可能" ON posts
  FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "ユーザーは自分の投稿を更新可能" ON posts
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "ユーザーは自分の投稿を削除可能" ON posts
  FOR DELETE USING (auth.uid() = author_id);

-- ユーザー登録時に自動でプロファイルを作成するトリガー
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- updated_atの自動更新トリガー
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();