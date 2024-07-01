## SvelteKit Supabase template

This is a work-in-progress template for SvelteKit (with Svelte 5) using Supabase. This is an
[article](https://www.thespatula.io/svelte/sveltekit_supabase/) discussing some of the details of the authentication process.

It's built using Tailwind and DaisyUI, has light and dark modes and a simple profile page that allows changing one's profile image.

### Setup

#### 1. Clone the repo and install libraries

```bash
git clone https://github.com/kilroyjones/sveltekit-supabase-template
cd sveltekit-supabase-template
npm i
```

#### 2.Getting Google OAuth keys

On the [Google dashboard](https://console.cloud.google.com/apis/dashboard) either select an exisitng project or create a new one. The go to **Credentials** and **Create Credentials** then select **OAuth client id** and go through the process, putting in _http://localhost:5173_ for **URIs1**. For _Authorized redirect URIs_ you can put anything for now, but we'll replace it after the next step.

#### 3. Supabase project

In Supabase you can create a new project or modify an existing one. Then go to **Authentication** and **Providers** and **Google** and copy in your Client ID and Secret from the Google Dashboard, after which you can copy the **Callback URL** in the space from step 2.

This will connect Supabase with Google.

#### 4. Create users table

This will be our public users tables:

```sql
CREATE TABLE users (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY REFERENCES auth.users(id),
    email varchar,
    username varchar NOT NULL,
    profile_image varchar,
    role varchar,
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamptz,
    FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE
);
```

#### 5. Set policies for users table

This allows users to select their own information:

```sql
CREATE POLICY "select_own_user" ON users
FOR SELECT USING (
    auth.uid() = id
);
```

#### 6. Create storage

Under storage create a new bucket called **profile_images** and then create a policy which allows authenticated users to read the images.

You should also upload the **default-avatar.jpg** to the bucket. This can be found in the **static/defaults** folder.

#### 7. Set up the environment variables

Under the Supabase settings in **API** and **Storage** you'll find the URLs and keys needs to complete the environment variables found in **example.env**. Then you can do the following:

```bash
cp example.env .env
```

#### 8. Run the program

```bash
npm run dev
```

You should then be able to go to [http://localhost:5173](http://localhost:5173) and run the program as normal.
