const get_user_api = async (user_id: string) => {
  const data = await fetch(`https://vrchat.com/api/1/users/${user_id}`, {
      "credentials": "include",
      "headers": {
          "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:151.0) Gecko/20100101 Firefox/151.0",
          "Accept": "application/json",
          "Cookie": `auth=${process.env.VRCHAT_AUTH}; twoFactorAuth=${process.env.VRCHAT_TWO_FACTOR_AUTH}`
      },
      "method": "GET",
  });
  console.log(await data.json());
}

get_user_api("usr_e4c94acd-b8d2-4dfa-92db-57365a32ab1b")
