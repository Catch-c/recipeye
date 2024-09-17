import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
  Storage,
} from "react-native-appwrite";

// Appwrite configuration
const appwriteConfig = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.sebcun.aora",
  projectId: "66e65ba40039c61e02e4",
  databaseId: "66e65ca7001e9e8ae05f",
  userCollectionId: "66e65cc0001c8a23c59a",
  recipeCollectionId: "66e7abdf00226ec64a8d",
  storageId: "66e65dbd000dfb4053aa",
};

// Initialize Appwrite client
const client = new Client()
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId)
  .setPlatform(appwriteConfig.platform);

const account = new Account(client);
const storage = new Storage(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

// Create user
export async function createUser(email, password, username) {
  try {
    const newAccount = await account.create(ID.unique(), email, password, username);
    const avatarUrl = avatars.getInitials(username);
    await signIn(email, password);

    return await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email,
        username,
        avatar: avatarUrl,
      }
    );
  } catch (error) {
    throw new Error(error);
  }
}

// Sign in
export async function signIn(email, password) {
  try {
    return await account.createEmailSession(email, password);
  } catch (error) {
    throw new Error(error);
  }
}

// Get account
export async function getAccount() {
  try {
    return await account.get();
  } catch (error) {
    throw new Error(error);
  }
}

// Get current user
export async function getCurrentUser() {
  try {
    const currentAccount = await getAccount();
    if (!currentAccount) throw new Error("No account found");

    const userDocuments = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!userDocuments.documents.length) throw new Error("No user found");

    return userDocuments.documents[0];
  } catch (error) {
    console.log(error);
    return null;
  }
}

// Sign out
export async function signOut() {
  try {
    return await account.deleteSession("current");
  } catch (error) {
    throw new Error(error);
  }
}

export const uploadImage = async (image) => {
  console.log("===========================")
  const response = await fetch(image);
  console.log(response);
  const blob = await response.blob();
  console.log(blob);
  try {
    const response = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      file
    );

    return response;
  } catch (error) {
    throw new Error(error);
  }
}

// Get File Preview
export const getFilePreview = async (fileId) => {
  try {
    const preview = await storage.getFilePreview(
      appwriteConfig.storageId,
      fileId
    );

    return preview.href;
  } catch (error) {
    throw new Error(error);
  }
}

// Create recipe post
export async function createRecipe(title, recipeArray, creatorId, thumbnail = null) {

  try {
    console.log(recipeArray)
    if (thumbnail) {
      return await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.recipeCollectionId,
        ID.unique(),
        {
          title: title,
          creator: creatorId,
          info: recipeArray,
          thumbnail: thumbnail
        }
      );
    } else {
      return await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.recipeCollectionId,
        ID.unique(),
        {
          title: title,
          creator: creatorId,
          info: recipeArray
        }
      );
    }

  } catch (error) {
    console.log(error)
    throw new Error(error);
  }
}

export async function getRecipeById(recipeId) {
  try {
    const response = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.recipeCollectionId,
      recipeId,
      []
    );
    return response;
  } catch (error) {
    console.error("Error fetching recipe:", error);
    throw new Error(error);
  }
}

// Get all recipe posts
export async function getAllPosts() {
  try {
    const posts = await databases.listDocuments(appwriteConfig.databaseId, appwriteConfig.recipeCollectionId);
    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
}

// Get recipe posts created by user
export async function getUserPosts(userId) {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.recipeCollectionId,
      [Query.equal("creator", userId)]
    );
    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
}

// Search recipe posts
export async function searchPosts(query) {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.recipeCollectionId,
      [Query.search("title", query)]
    );

    if (!posts) throw new Error("Something went wrong");

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
}

// Get latest created recipe posts
export async function getLatestPosts() {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.recipeCollectionId,
      [Query.orderDesc("$createdAt"), Query.limit(7)]
    );
    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
}
