'use server'
const signUp = async (formData: FormData) => {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const username = formData.get('username') as string;
    console.log("SIGN UP DATA:", {email, password, username});
}