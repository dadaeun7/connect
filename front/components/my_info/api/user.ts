export async function updateUserInfo(
  name: string,
): Promise<{ success: boolean }> {
  const res = await fetch(`/update/info`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: name,
      affiliation: "",
    }),
  });

  if (!res.ok) {
    throw new Error("name update error");
  }

  return res.json();
}

export async function withdrawUser(
  withdrawFn: () => Promise<boolean>,
): Promise<boolean> {
  const result = await withdrawFn();
  if (!result) {
    throw new Error("Withdrawal failed");
  }
  return result;
}
