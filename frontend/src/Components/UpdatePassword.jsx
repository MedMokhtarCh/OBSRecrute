import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  clearAllUpdateProfileErrors,
  updatePassword,
} from "../store/Slices/updateProfileSlice";
import { getUser } from "../store/Slices/userSlice";
import { FaRegEyeSlash, FaEye } from "react-icons/fa";
import Swal from "sweetalert2"; // Assurez-vous que SweetAlert est correctement importé

const UpdatePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { loading, error, isUpdated } = useSelector(
    (state) => state.updateProfile
  );

  const dispatch = useDispatch();

  const handleUpdatePassword = () => {
    const formData = new FormData();
    formData.append("oldPassword", oldPassword);
    formData.append("newPassword", newPassword);
    formData.append("confirmPassword", confirmPassword);

    dispatch(updatePassword(formData));
  };

  useEffect(() => {
    if (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error,
      });
      dispatch(clearAllUpdateProfileErrors());
    }
    if (isUpdated) {
      Swal.fire({
        title: 'Password Updated',
        text: 'Your password has been successfully updated.',
        icon: 'success',
        timer: 1600,
        timerProgressBar: true,
        showConfirmButton: false,
      });
      dispatch(getUser());
      dispatch(clearAllUpdateProfileErrors());
    }
  }, [dispatch, loading, error, isUpdated]);

  const handleModalSave = () => {
    if (newPassword !== confirmPassword) {
      // Affichage du message d'erreur avec SweetAlert
      Swal.fire({
        icon: 'error',
        title: 'Passwords do not match',
        text: 'The new password and confirm password do not match. Please try again.',
        
          timerProgressBar: true,
          showConfirmButton: false,
      });
      return; // Ne pas afficher le modal de confirmation si les mots de passe ne correspondent pas
    }

    Swal.fire({
      title: "Do you want to save the changes?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Save",
      denyButtonText: "Don't save",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        handleUpdatePassword();
        Swal.fire({
          title: "Saved!",
          text: "Your modifications are saved.",
          icon: "success",
          timer: 1600,
          timerProgressBar: true,
          showConfirmButton: false,
        });
      } else if (result.isDenied) {
        Swal.fire({
          title: "Changes are not saved",
          text: "Your modifications have been ignored",
          icon: "error",
          timer: 1600,
          timerProgressBar: true,
          showConfirmButton: false,
        });
      }
    });
  };

  return (
    <div className="account_components update_password_component">
      <h3>Update Password</h3>
      <div>
        <label>Current Password</label>
        <input
          type={showPassword ? "text" : "password"}
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />
        {showPassword ? (
          <FaRegEyeSlash
            className="eye_icon"
            onClick={() => setShowPassword(!showPassword)}
          />
        ) : (
          <FaEye
            className="eye_icon"
            onClick={() => setShowPassword(!showPassword)}
          />
        )}
      </div>
      <div>
        <label>New Password</label>
        <input
          type={showPassword ? "text" : "password"}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        {showPassword ? (
          <FaRegEyeSlash
            className="eye_icon"
            onClick={() => setShowPassword(!showPassword)}
          />
        ) : (
          <FaEye
            className="eye_icon"
            onClick={() => setShowPassword(!showPassword)}
          />
        )}
      </div>
      <div>
        <label>Confirm Password</label>
        <input
          type={showPassword ? "text" : "password"}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        {showPassword ? (
          <FaRegEyeSlash
            className="eye_icon"
            onClick={() => setShowPassword(!showPassword)}
          />
        ) : (
          <FaEye
            className="eye_icon"
            onClick={() => setShowPassword(!showPassword)}
          />
        )}
      </div>
      
        <button
           className="save_change_btn_wrapper"
          onClick={handleModalSave}
          disabled={loading || !oldPassword || !newPassword || !confirmPassword}
        >
          {loading ? "Updating..." : "Update Password"}
        </button>
   
    </div>
  );
};

export default UpdatePassword;
