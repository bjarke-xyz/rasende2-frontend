export const Badge: React.FC<{ text: string }> = ({ text }) => {
  return (
    <span className="bg-blue-100 text-blue-800 font-semibold mr-0.5 px-2.5 rounded dark:bg-blue-200 dark:text-blue-800">
      {text}
    </span>
  );
};
