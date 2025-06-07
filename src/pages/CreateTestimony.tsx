import React, { useState, useEffect } from "react";
import { Save, Eye, Upload, Plus, X, FileText, Tag } from "lucide-react";

// TypeScript interfaces
interface Article {
  id: string;
  title: string;
  content: string;
  categories: string[];
  thumbnail: string | null;
  status: "draft" | "published";
  createdAt: Date;
  updatedAt: Date;
}

const CreateTestimony = () => {
  // State management
  const [articles, setArticles] = useState<Article[]>([]);
  const [currentArticle, setCurrentArticle] = useState<Article | null>(null);
  const [, setIsEditing] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  // Initialize with sample data
  useEffect(() => {
    const sampleArticle: Article = {
      id: "1",
      title: "Welcome to the Article Editor",
      content:
        "Start writing your article here...\n\nYou can use this editor to create and manage your articles with ease.",
      categories: ["tutorial", "welcome"],
      thumbnail: null,
      status: "draft",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setArticles([sampleArticle]);
    setCurrentArticle(sampleArticle);
  }, []);

  // Create new article
  const createNewArticle = () => {
    const newArticle: Article = {
      id: Date.now().toString(),
      title: "Untitled Article",
      content: "",
      categories: [],
      thumbnail: null,
      status: "draft",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setArticles((prev) => [...prev, newArticle]);
    setCurrentArticle(newArticle);
    setIsEditing(true);
    setShowPreview(false);
  };

  // Save article
  const saveArticle = () => {
    if (!currentArticle) return;

    const updatedArticle = {
      ...currentArticle,
      updatedAt: new Date(),
    };

    setArticles((prev) =>
      prev.map((article) =>
        article.id === currentArticle.id ? updatedArticle : article
      )
    );
    setCurrentArticle(updatedArticle);
    setIsEditing(false);
  };

  // Publish article
  const publishArticle = () => {
    if (!currentArticle) return;

    const publishedArticle = {
      ...currentArticle,
      status: "published" as const,
      updatedAt: new Date(),
    };

    setArticles((prev) =>
      prev.map((article) =>
        article.id === currentArticle.id ? publishedArticle : article
      )
    );
    setCurrentArticle(publishedArticle);
  };

  // Handle thumbnail upload
  const handleThumbnailUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file && currentArticle) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const thumbnail = e.target?.result as string;
        setCurrentArticle((prev) => (prev ? { ...prev, thumbnail } : null));
      };
      reader.readAsDataURL(file);
    }
  };

  // Add category
  const addCategory = () => {
    if (newCategory.trim() && currentArticle) {
      const category = newCategory.trim().toLowerCase();
      if (!currentArticle.categories.includes(category)) {
        setCurrentArticle((prev) =>
          prev
            ? {
                ...prev,
                categories: [...prev.categories, category],
              }
            : null
        );
      }
      setNewCategory("");
    }
  };

  // Remove category
  const removeCategory = (categoryToRemove: string) => {
    if (currentArticle) {
      setCurrentArticle((prev) =>
        prev
          ? {
              ...prev,
              categories: prev.categories.filter(
                (cat) => cat !== categoryToRemove
              ),
            }
          : null
      );
    }
  };

  // Select article from list
  const selectArticle = (article: Article) => {
    setCurrentArticle(article);
    setIsEditing(false);
    setShowPreview(false);
  };

  if (!currentArticle) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              No Article Selected
            </h2>
            <button
              onClick={createNewArticle}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
            >
              <Plus className="w-5 h-5" />
              Create New Article
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-900">Article Editor</h1>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                currentArticle.status === "published"
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {currentArticle.status}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Eye className="w-4 h-4" />
              {showPreview ? "Edit" : "Preview"}
            </button>

            <button
              onClick={saveArticle}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              Save
            </button>

            <button
              onClick={publishArticle}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Publish
            </button>

            <button
              onClick={createNewArticle}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              New
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 flex gap-6">
        {/* Sidebar - Articles List */}
        <div className="w-80 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-900 mb-4">Articles</h3>
          <div className="space-y-2">
            {articles.map((article) => (
              <div
                key={article.id}
                onClick={() => selectArticle(article)}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  currentArticle.id === article.id
                    ? "bg-blue-50 border border-blue-200"
                    : "hover:bg-gray-50 border border-transparent"
                }`}
              >
                <div className="font-medium text-gray-900 truncate">
                  {article.title}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {article.updatedAt.toLocaleDateString()}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      article.status === "published"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {article.status}
                  </span>
                  {article.categories.slice(0, 2).map((cat) => (
                    <span
                      key={cat}
                      className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Editor */}
        <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200">
          {showPreview ? (
            // Preview Mode
            <div className="p-8">
              <div className="max-w-4xl mx-auto">
                {currentArticle.thumbnail && (
                  <img
                    src={currentArticle.thumbnail}
                    alt="Article thumbnail"
                    className="w-full h-64 object-cover rounded-lg mb-6"
                  />
                )}
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  {currentArticle.title}
                </h1>
                <div className="flex items-center gap-2 mb-6">
                  {currentArticle.categories.map((category) => (
                    <span
                      key={category}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                    >
                      {category}
                    </span>
                  ))}
                </div>
                <div className="prose max-w-none">
                  {currentArticle.content
                    .split("\n")
                    .map((paragraph, index) => (
                      <p
                        key={index}
                        className="mb-4 text-gray-700 leading-relaxed"
                      >
                        {paragraph || "\u00A0"}
                      </p>
                    ))}
                </div>
              </div>
            </div>
          ) : (
            // Edit Mode
            <div className="p-6">
              {/* Thumbnail Upload */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Thumbnail
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailUpload}
                    className="hidden"
                    id="thumbnail-upload"
                  />
                  <label
                    htmlFor="thumbnail-upload"
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    Upload Thumbnail
                  </label>
                  {currentArticle.thumbnail && (
                    <img
                      src={currentArticle.thumbnail}
                      alt="Thumbnail preview"
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  )}
                </div>
              </div>

              {/* Title */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={currentArticle.title}
                  onChange={(e) =>
                    setCurrentArticle((prev) =>
                      prev ? { ...prev, title: e.target.value } : null
                    )
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xl font-semibold"
                  placeholder="Enter article title..."
                />
              </div>

              {/* Categories */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categories
                </label>
                <div className="flex items-center gap-2 mb-3">
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addCategory()}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Add category..."
                  />
                  <button
                    onClick={addCategory}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {currentArticle.categories.map((category) => (
                    <span
                      key={category}
                      className="flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                    >
                      <Tag className="w-3 h-3" />
                      {category}
                      <button
                        onClick={() => removeCategory(category)}
                        className="ml-1 hover:text-blue-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content
                </label>
                <textarea
                  value={currentArticle.content}
                  onChange={(e) =>
                    setCurrentArticle((prev) =>
                      prev ? { ...prev, content: e.target.value } : null
                    )
                  }
                  className="w-full h-96 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none font-mono text-sm"
                  placeholder="Start writing your article..."
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateTestimony;
