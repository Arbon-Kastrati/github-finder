const UserSearch = () => {
    return (
        <section className="w-lg m-auto p-6 bg-white rounded-lg shadow-md mt-30">
            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold">Github Finder</h1>
            </div>
            <form action="">
                <input
                    type="text"
                    placeholder="Search GitHub profile..."
                    className="w-full rounded-lg p-3 border border-2 border-gray-300 mb-2"
                />
                <button className="w-full p-3 bg-blue-600 text-white text-lg rounded-lg cursor-pointer hover:bg-blue-700">
                    Submit
                </button>
            </form>
        </section>
    );
};

export default UserSearch;
