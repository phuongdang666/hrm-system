export default function InputError({ message }: { message?: string }) {
    if (!message) return null;
    return <p className="text-sm text-red-600 mt-2">{message}</p>;
}
