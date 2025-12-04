import { useEffect } from "react";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const AdminLogout: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    signOut(auth).then(() => {
      navigate("/admin/login");
    });
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-samiraWhite">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-samiraBlue mb-4">Logout...</h2>
        <p className="text-samiraGold">Anda sedang logout, mohon tunggu.</p>
      </div>
    </div>
  );
};

export default AdminLogout;