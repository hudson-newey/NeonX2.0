class User {
  constructor(public username: string, public password: string) {
    this.#username = username;
    this.#password = password;
  }

  #username: string;
  #password: string;

  public login(username: string, password: string): boolean {
    return this.#username === username && this.#password === password;
  }
}

const users: User[] = [
  new User("admin", "admin")
];

function isFormValid(): boolean {
  const usernameInput = document.getElementById("usr") as HTMLInputElement;
  const passwordInput = document.getElementById("pass") as HTMLInputElement;

  const loginUsername = usernameInput.value;
  const loginPassword = passwordInput.value;

  return users.some(user => user.login(loginUsername, loginPassword));
}
