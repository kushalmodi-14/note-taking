import { useState } from "react";
import PropTypes from "prop-types";
import { MdAdd, MdClose } from "react-icons/md";

const TagInput = ({ tags, setTags }) => {
    const [inputValue, setInputValue] = useState("");

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const addNewTag = () => {
        if (inputValue.trim() !== "") {
            setTags([...tags, inputValue.trim()]);
            setInputValue("");
        }
    };

    const handleRemoveTags = (tagToRemove) => {
        setTags(tags.filter((tag) => tag !== tagToRemove));
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            addNewTag();
        }
    };

    return (
        <div>
            {tags.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap mt-2">
                    {tags.map((tag, index) => (
                        <span
                            key={index}
                            className="flex items-center gap-2 text-sm text-black bg-slate-100 px-3 py-1 rounded"
                        >
                            #{tag}
                            <button
                                onClick={() => handleRemoveTags(tag)}
                                aria-label={`Remove tag ${tag}`}
                            >
                                <MdClose />
                            </button>
                        </span>
                    ))}
                </div>
            )}

            <div className="flex items-center gap-4 mt-3">
                <input
                    type="text"
                    placeholder="Add Tags"
                    className="text-sm bg-transparent border px-3 py-2 rounded outline-none"
                    onKeyDown={handleKeyDown}
                    onChange={handleInputChange}
                    value={inputValue}
                    aria-label="Add a tag"
                />
                <button
                    onClick={addNewTag}
                    disabled={inputValue.trim() === ""}
                    className={`h-8 w-8 flex items-center justify-center border ${inputValue.trim() ? 'border-blue-400 hover:bg-blue-500' : 'border-gray-300 cursor-not-allowed'}`}
                    aria-label="Add tag button"
                >
                    <MdAdd className={`text-2xl ${inputValue.trim() ? 'text-blue-600 hover:text-white' : 'text-gray-300'}`} />
                </button>
            </div>
        </div>
    );
};

TagInput.propTypes = {
    tags: PropTypes.arrayOf(PropTypes.string).isRequired,
    setTags: PropTypes.func.isRequired,
};

export default TagInput;
