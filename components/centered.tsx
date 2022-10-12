export const Centered: React.FC<{
  children: React.ReactNode;
  bigText?: boolean;
}> = ({ children, bigText }) => {
  return (
    <div className="flex justify-center">
      <div className={`${bigText ? "text-5xl" : "text-3xl"} leading-relaxed`}>
        {children}
      </div>
    </div>
  );
};
