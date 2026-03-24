export async function loginUser(username, password) {
  const credentials = btoa(`${username}:${password}`);

  const res = await fetch("https://learn.zone01oujda.ma/api/auth/signin", {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
    },
  });

  if (!res.ok) {
    throw new Error("Invalid Username or Password!");
  }
  const token = await res.json();
  return token;
}
