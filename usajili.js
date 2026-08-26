const { createClient } = supabase;

const db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const form = document.querySelector("form");

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const data = new FormData(form);

  const { error } = await db.from("members").insert({
    full_name: data.get("full_name"),
    phone: data.get("phone"),
    whatsapp: data.get("whatsapp"),
    gender: data.get("gender"),
    marital_status: data.get("marital_status"),
    birth_date: data.get("birth_date") || null,
    location: data.get("location"),
    street: data.get("street"),
    ministry: data.get("ministry"),
    message: data.get("message"),
    registration_fee: 5000,
    payment_number: "0619092049",
    status: "pending"
  });

  if (error) {
    alert("Samahani, usajili haujakamilika. Jaribu tena.");
    console.error(error);
    return;
  }

  alert("✅ Ombi lako limetumwa! Lipo Pending mpaka malipo ya TSh 5,000 yatakapothibitishwa na uongozi.");
  form.reset();
});
