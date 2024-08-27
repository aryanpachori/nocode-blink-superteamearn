"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

const App = () => {
  const { register, handleSubmit, watch } = useForm({
    defaultValues: {
      toPubkey: "",
      amount: "",
      title: "",
      description: "",
      imageUrl: "",
      requirements: "",
      scope: "",
      timeline: "",
      payment: "",
    },
  });

  const [url, setUrl] = useState("");
  const [copyStatus, setCopyStatus] = useState("Copy");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const watchedValues = watch();

  const generateSummary = async (description : any) => {
    try {
      setIsLoading(true);
      setError("");
      
      const response = await axios.post('/api/summarizer', { description });
      
      return response.data.summary;
    } catch (err) {
      setError("Failed to summarize description");
      return description;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const {
      toPubkey,
      amount,
      title,
      description,
      imageUrl,
      requirements,
      scope,
      timeline,
      payment,
    } = watchedValues;

    if (
      toPubkey &&
      amount &&
      title &&
      description &&
      requirements &&
      scope &&
      timeline &&
      payment
    ) {
      generateSummary(description).then((summary) => {
        const descriptionCombined = `
          Requirements: ${requirements}\n
          Scope: ${scope}\n
          Timeline: ${timeline}\n
          Payment: ${payment}\n
          ${summary}
        `;

        const encodedToPubkey = encodeURIComponent(toPubkey);
        const encodedTitle = encodeURIComponent(title);
        const encodedDescription = encodeURIComponent(descriptionCombined);
        const encodedImageUrl = encodeURIComponent(imageUrl || "");

        const baseUrl = "https://nocode-blink-superteamearn.vercel.app/api/actions/createProject";
        const queryString = `?to=${encodedToPubkey}&title=${encodedTitle}&description=${encodedDescription}&imageUrl=${encodedImageUrl}`;
        const fullUrl = `${baseUrl}${queryString}`;

        const encodedFullUrl = encodeURIComponent(fullUrl);
        const generatedUrl = `https://dial.to/?action=solana-action%3A${encodedFullUrl}`;

        setUrl(generatedUrl);
        setCopyStatus("Copy");
      });
    }
  }, [watchedValues]);

  const copyToClipboard = () => {
    if (url) {
      navigator.clipboard.writeText(url);
      setCopyStatus("Copied");
      setTimeout(() => setCopyStatus("Copy"), 2000);
    }
  };

  return (
    <div className="container mx-auto p-4 bg-white text-black">
      <h1 className="text-4xl mt-10 flex justify-center mb-6">
        Blink for Projects
      </h1>
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/3 border border-solid rounded-md border-black p-6">
          <form className="space-y-4">
            <div>
              <label htmlFor="imageUrl" className="block mb-1">
                Image URL:
              </label>
              <input
                type="url"
                id="imageUrl"
                placeholder="https://example.com/photo"
                {...register("imageUrl")}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label htmlFor="toPubkey" className="block mb-1">
                Your Solana Wallet Address:
              </label>
              <input
                type="text"
                id="toPubkey"
                {...register("toPubkey")}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label htmlFor="amount" className="block mb-1">
                Amount (SOL):
              </label>
              <input
                type="number"
                id="amount"
                placeholder="1"
                {...register("amount")}
                className="w-full p-2 border rounded"
                step="0.01"
              />
            </div>
            <div>
              <label htmlFor="title" className="block mb-1">
                Title:
              </label>
              <input
                type="text"
                placeholder="Superteam Germany Merch"
                id="title"
                {...register("title")}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label htmlFor="description" className="block mb-1">
                Description:
              </label>
              <input
                type="text"
                id="description"
                placeholder="Superteam Limited Edition Cap"
                {...register("description")}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label htmlFor="requirements" className="block mb-1">
                Requirements:
              </label>
              <input
                type="text"
                id="requirements"
                placeholder="List your requirements"
                {...register("requirements")}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label htmlFor="scope" className="block mb-1">
                Scope:
              </label>
              <input
                type="text"
                id="scope"
                placeholder="Define the project scope"
                {...register("scope")}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label htmlFor="timeline" className="block mb-1">
                Timeline:
              </label>
              <input
                type="text"
                id="timeline"
                placeholder="Project timeline"
                {...register("timeline")}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label htmlFor="payment" className="block mb-1">
                Payment:
              </label>
              <input
                type="text"
                id="payment"
                placeholder="Payment details"
                {...register("payment")}
                className="w-full p-2 border rounded"
              />
            </div>
            <button
              type="button"
              onClick={handleSubmit(() => {})}
              className="px-4 py-2 rounded-md bg-black text-white"
              disabled={isLoading}
            >
              {isLoading ? "Generating..." : "Generate URL"}
            </button>
            {error && <p className="text-red-500">{error}</p>}
          </form>
        </div>

        {url && (
          <div className="md:w-2/3 ml-8 mt-4 md:mt-0">
            <div className="mb-4">
              <p className="text-lg">Generated URL:</p>
              <div className="p-2 border rounded border-black break-words">
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600"
                >
                  {url}
                </a>
                <br />
                <button
                  onClick={copyToClipboard}
                  className="m-2 px-4 py-2 rounded-md bg-black text-white"
                >
                  {copyStatus}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
