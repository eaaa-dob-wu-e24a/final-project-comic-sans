import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../contexts/authcontext";

export default function ProfileAvatar({ className = "", variant = "small" }) {
  const { user } = useContext(AuthContext);
  const [imageError, setImageError] = useState(false);

  const baseStyles =
    "rounded-full bg-secondary text-white flex items-center justify-center font-bold";
  const variants = {
    small: "w-8 h-8 text-sm",
    large: "w-32 h-32 text-3xl",
  };

  const imageClass = `${variants[variant]} rounded-full object-cover ${className}`;

  useEffect(() => {
    // Reset imageError when user.imagePath changes
    setImageError(false);
  }, [user.imagePath]);

  if (!user) {
    return null; // Or render a placeholder
  }

  const imageUrl = process.env.NEXT_PUBLIC_API_URL + user.imagePath;

  return (
    <div>
      {user.imagePath && !imageError ? (
        <img
          src={imageUrl}
          alt={user.name}
          className={imageClass}
          onError={() => setImageError(true)}
        />
      ) : (
        <div className={`${baseStyles} ${variants[variant]} ${className}`}>
          {user.name ? user.name.charAt(0).toUpperCase() : "?"}
        </div>
      )}
    </div>
  );
}
