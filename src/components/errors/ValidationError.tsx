const ValidationError = ({ message }: { message: string | undefined }) => {
    return <p className="bg-red-500 text-white ">{message}</p>;
};

export default ValidationError;
