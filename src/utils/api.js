const createUrl = (path) => {
  return window.location.origin + path;
};

export const getYoutubeStore = async (link) => {
  try {
    const res = await fetch(
      new Request(createUrl(`/api/link/${link}`), {
        method: "GET",
      })
    );

    if (res.ok) {
      const data = await res.json();
      return data.data;
    } else {
      throw new Error("Failed to fetch data");
    }
  } catch (error) {
    console.error("Error fetching AI response:", error);
    throw new Error("Failed to fetch AI response");
  }
};

export const getAIResponse = async (link, chatHistory) => {
  try {
    const res = await fetch(
      new Request(createUrl(`/api/chat/${link}`), {
        method: "POST",
        body: JSON.stringify(chatHistory),
      })
    );
    if (res.ok) {
      const data = await res.json();
      return data.data;
    } else {
      throw new Error("Failed to fetch data");
    }
  } catch (error) {
    console.error("Error fetching AI response:", error);
    throw new Error("Failed to fetch AI response");
  }
};
