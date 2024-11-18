const BASE_URL = 'http://localhost:5000/api/users';

export const fetchUser = async (referenceId) => {
  try {
    const response = await fetch(`${BASE_URL}/${referenceId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const userData = await response.json();
    return userData;
  } catch (err) {
    console.error('Lỗi khi fetch user:', err.message);
    throw err;
  }
};
