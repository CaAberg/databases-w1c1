import Link from "next/link";

const AccountLinks = () => { 
    return ( 
    <div className="space-x-4">
        <Link href="/login" className="p-4 bg-emerald-700 rounded">Login</Link>
        <Link href="/logout" className="p-4 bg-red-700 rounded">Logout</Link>
    </div>
    );
}

export default AccountLinks;