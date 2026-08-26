const SUPABASE_URL = "https://umjgletjwjdffwoadhtf.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_Kl-FesowIP0SOOwbtuQWLQ_I3srIHDd";

const supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

const loginScreen = document.getElementById("loginScreen");
const adminApp = document.getElementById("adminApp");
const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");
const adminEmail = document.getElementById("adminEmail");
const logoutBtn = document.getElementById("logoutBtn");

async function checkAdmin(user) {
  if (!user) return false;

  // Admin account(s)
  const allowedAdmins = [
    "admin@christianonenessministry.com"
  ];

  return allowedAdmins.includes(
    (user.email || "").toLowerCase()
  );
}

async function showDashboard(user) {
  if (!user) {
    showLogin();
    return;
  }

  const isAdmin = await checkAdmin(user);

  if (!isAdmin) {
    await supabaseClient.auth.signOut();

    loginMessage.textContent =
      "Huna ruhusa ya kuingia kwenye Admin Dashboard.";

    showLogin();
    return;
  }

  loginScreen.classList.add("hidden");
  adminApp.classList.remove("hidden");

  if (adminEmail) {
    adminEmail.textContent = user.email;
  }
}

function showLogin() {
  loginScreen.classList.remove("hidden");
  adminApp.classList.add("hidden");
}

loginForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document
    .getElementById("email")
    .value
    .trim();

  const password = document
    .getElementById("password")
    .value;

  loginMessage.textContent = "Inaingia...";

  const { data, error } =
    await supabaseClient.auth.signInWithPassword({
      email,
      password
    });

  if (error) {
    loginMessage.textContent =
      "Email au password si sahihi.";
    return;
  }

  const isAdmin = await checkAdmin(data.user);

  if (!isAdmin) {
    await supabaseClient.auth.signOut();

    loginMessage.textContent =
      "Akaunti hii haina ruhusa ya Admin.";
    return;
  }

  loginMessage.textContent = "";
  await showDashboard(data.user);
});

logoutBtn?.addEventListener("click", async () => {
  await supabaseClient.auth.signOut();
  showLogin();
  loginMessage.textContent = "";
});

document.querySelectorAll(".sidebar nav button")
  .forEach((button) => {
    button.addEventListener("click", () => {

      const target =
        button.getAttribute("data-section");

      document
        .querySelectorAll(".sidebar nav button")
        .forEach((btn) => btn.classList.remove("active"));

      document
        .querySelectorAll(".section")
        .forEach((section) => section.classList.remove("active"));

      button.classList.add("active");

      const section =
        document.getElementById(target);

      if (section) {
        section.classList.add("active");
      }
    });
  });

supabaseClient.auth.onAuthStateChange(
  async (_event, session) => {
    if (session?.user) {
      await showDashboard(session.user);
    } else {
      showLogin();
    }
  }
);

(async function init() {
  const {
    data: { session }
  } = await supabaseClient.auth.getSession();

  if (session?.user) {
    await showDashboard(session.user);
  } else {
    showLogin();
  }
})();
