const GenericError = ({ message }: { message: string | undefined }) => {
    return (
        <p className="bg-red-500 text-white text-center rounded-lg p-2 mb-2">
            {message}
        </p>
    );
};

export default GenericError;
