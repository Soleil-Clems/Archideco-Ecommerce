import Robot from "../assets/robot.png";
import { useState } from "react";
import { getAssistant } from "../Requests/AuthRequest";

export default function Assistant() {
  const [click, setClick] = useState<boolean>(false);

  const handleClick = () => {
    setClick((prevClick) => !prevClick);
  };

  return (
    <div className="fixed bottom-5 right-10 z-10 bg-blue-500 h-16 w-16 rounded-full flex items-center justify-center hover:cursor-pointer">
      <img src={Robot} alt="" onClick={handleClick} />
      {click && <PopupAssistant handleClose={handleClick} />}
    </div>
  );
}

// Composant pour rendre les messages avec des liens cliquables
const Message = ({ role, content }: { role: string; content: string }) => {
  // Fonction pour transformer les URLs en liens cliquables
  const formatContent = (text: string) => {
    // Regex améliorée pour détecter les URLs, y compris localhost
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.split(urlRegex).map((part, index) =>
      urlRegex.test(part) ? (
        <a
          key={index}
          href={part.replace(/[()]/g, "")}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 underline"
        >
          {part.replace(/[()]/g, "")}
        </a>
      ) : (
        part
      )
    );
  };

  return (
    <div
      className={`p-2 rounded-lg shadow-md ${
        role === "user" ? "bg-blue-500 text-white" : "bg-gray-200"
      }`}
    >
      {formatContent(content)}
    </div>
  );
};

const PopupAssistant = ({ handleClose }: { handleClose: () => void }) => {
  const [question, setQuestion] = useState<string>("");
  const [responses, setResponses] = useState<
    { role: string; content: string }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuestion(e.target.value);
  };

  const handleSubmit = async () => {
    if (!question.trim()) return;

    const userQuestion = question;
    setQuestion("");
    setLoading(true);

    try {
      const answer = await getAssistant(userQuestion);
      setResponses((prevResponses) => [
        ...prevResponses,
        { role: "user", content: userQuestion },
        { role: "assistant", content: answer },
      ]);
    } catch (error) {
      console.error("Erreur lors de la récupération de la réponse :", error);
      setResponses((prevResponses) => [
        ...prevResponses,
        { role: "user", content: userQuestion },
        {
          role: "assistant",
          content: "Désolé, je ne peux pas répondre à cette question.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-96 w-80 bg-white z-20 absolute bottom-20 right-10 rounded-lg shadow-lg flex flex-col">
      <div className="bg-blue-500 text-white rounded-t-lg p-4 flex justify-between items-center">
        <h2 className="text-lg font-semibold">Roquet Assistant</h2>
        <button
          className="text-white hover:text-gray-200 focus:outline-none"
          onClick={handleClose}
        >
          ×
        </button>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        {responses.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            } mb-4`}
          >
            <Message role={msg.role} content={msg.content} />
          </div>
        ))}
        {loading && <div className="text-center">Chargement...</div>}
      </div>

      <div className="p-2 border-t border-gray-200 flex items-center">
        <input
          type="text"
          value={question}
          onChange={handleQuestionChange}
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Écrivez un message..."
        />
        <button
          onClick={handleSubmit}
          className="ml-2 bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 focus:outline-none"
        >
          Envoyer
        </button>
      </div>
    </div>
  );
};
