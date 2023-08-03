import React, { useState } from 'react'
import { useEffect } from 'react';
import Spinner from "./Spinner";

function Cards() {


    const [dropBox, setDropBox] = useState(false);
    const [head, setHead] = useState("");

    const [onDelete, setOnDelete] = useState(false);
    const [noteId, setNoteId] = useState("");


    // Spinner
    const [loading, setLoading] = useState(false);


    // Notification
    const [notification, setNotification] = useState();
    const [isNotified, setIsNotified] = useState(false);


    // useState for notes
    const [data, setData] = useState([]);
    const [notedata, setNoteData] = useState([]);


    // useState for Adding Notes
    const [title, setTitle] = useState("");
    const [tagline, setTagline] = useState("");
    const [body, setBody] = useState("");

    // For card coloring
    const cardColors = ["bg-[#ff9b73]", "bg-[#e4ee90]", "bg-[#01d4ff]", "bg-[#b692fe]", "bg-[#ffc972]"];


    // For pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [startIndex, setStartIndex] = useState(0);
    const [endIndex, setEndIndex] = useState(5);
    const [currentItems, setCurrentItems] = useState([]);
    const itemsPerPage = 6;

    // Fetch Notes Function -> API Call

    const fetchApiData = async () => {
        try {
            const res = await fetch("https://notes-mern-website.vercel.app/list");
            const data = await res.json();
            data.sort((a, b) => {
                if (a.pinned !== b.pinned) {
                    return a.pinned ? -1 : 1; // Pinned items come before unpinned items
                } else {
                    // If both items have the same "pinned" value, sort by date
                    return new Date(a.date) - new Date(b.date);
                }
            });
            setData(data);

            // Calculate the total number of pages
            setTotalPages(Math.ceil(data.length / itemsPerPage));

            // Calculate the starting index of the current page
            setStartIndex((currentPage - 1) * itemsPerPage);

            // Calculate the ending index of the current page
            setEndIndex(startIndex + itemsPerPage);

            // Slice the data array to get the items for the current page
            setCurrentItems(data.slice(startIndex, endIndex));

            setNoteData(notes);
        } catch (error) {
            console.log(error);
        }
    };


    // Format Date Function
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = new Date(dateString).toLocaleDateString(undefined, options);
        return formattedDate;
    }



    // Function to show notes
    const notes = currentItems.map((item, index) => (

        <div className={`flex w-full flex-col ${cardColors[index % cardColors.length]} rounded-xl font-sans px-6 py-6 text-[#352119]`}>
            <div className='w-full text-[#3c393c] font-semibold text-xs'>
                {formatDate(item.date)}
            </div>
            <div className='w-full font-bold text-lg py-1'>
                {item.title}
            </div>
            <div className='w-full font-semibold text-base'>
                {item.tagline}
            </div>
            <div className='w-full font-normal text-base py-2'>
                {item.body}
            </div>
            <div className='w-full flex justify-between text-sm items-center pt-4'>
                <span className='text-[#765e30]' onClick={(e) => {
                    e.preventDefault();
                    handlePin(item._id, !item.pinned);
                }}><i className={`${(item.pinned) ? "text-amber-500" : "text-white"} cursor-pointer fa-solid fa-star bg-[#161516] p-3 rounded-full`}></i></span>
                <div className='flex gap-2'><i class="fa-solid fa-pen text-white bg-[#161516] p-3 rounded-full cursor-pointer" onClick={(e) => {
                    e.preventDefault();
                    setHead("Edit");
                    setTitle(item.title);
                    setTagline(item.tagline);
                    setBody(item.body);
                    setNoteId(item._id);
                    setDropBox(true);
                }}></i><i class="fa-solid fa-trash text-white bg-[#161516] p-3 rounded-full cursor-pointer" onClick={(e) => {
                    e.preventDefault();
                    setOnDelete(true);
                    setNoteId(item._id);
                }}></i></div>
            </div>
        </div>
    ));


    useEffect(() => {
        fetchApiData();
    });



    const notify = (mes) => {
        setNotification(mes);
        setIsNotified(true);
        setTimeout(() => {
            setIsNotified(false);
        }, 2000)
    }


    // Function to handle pin function
    const handlePin = async (noteId, pin) => {

        const updatedData = {
            "pinned": pin
        }

        try {
            const response = await fetch(`https://notes-mern-website.vercel.app/update/${noteId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedData)
            });

            if (response.ok) {
                console.log('Note pinned successfully');
                // Perform actions after successful update
            } else {
                console.error('Note pinned failed');
                // Handle errors
            }
        } catch (error) {
            console.error('An error occurred while pinning the note', error);
            // Handle errors
        }
    };





    // API call to delete a note by ID
    const deleteNote = async (noteId) => {
        try {
            const response = await fetch(`https://notes-mern-website.vercel.app/remove/${noteId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                notify('Note deleted successfully');
                console.log('Note deleted successfully');
                // Perform actions after successful deletion
            } else {
                notify('Note deletion failed', 'amber');
                console.error('Note deletion failed');
                // Handle errors
            }
        } catch (error) {
            notify('Error Occurred', 'red');
            console.error('An error occurred while deleting the note', error);
            // Handle errors
        }
    };



    // Function to edit a note by ID
    const editNote = async (noteId) => {


        const updatedData = {
            "title": title,
            "tagline": tagline,
            "body": body
        }

        try {
            const response = await fetch(`https://notes-mern-website.vercel.app/update/${noteId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedData)
            });

            if (response.ok) {
                notify('Note edited successfully');
                console.log('Note updated successfully');
                setLoading(false);
                setDropBox(false);
                // Perform actions after successful update
            } else {
                notify('Note edited failed');
                console.error('Note update failed');
                setLoading(false);
                setDropBox(false);
                // Handle errors
            }
        } catch (error) {
            notify('Error Occurred');
            console.error('An error occurred while updating the note', error);
            setLoading(false);
            setDropBox(false);
            // Handle errors
        }
    };





    // Add Notes Function -> API Call

    const handleSubmit = async () => {


        const postData = {
            "title": title,
            "tagline": tagline,
            "body": body
        }

        try {
            const response = await fetch('https://notes-mern-website.vercel.app/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(postData)
            });

            if (response.ok) {

                notify('Note Added Successfully');
                console.log('Post request successful');
                setLoading(false);
                setDropBox(false);
                // Perform actions after successful post
            } else {
                notify('Note Adding Failed');
                console.error('Post request failed');
                setLoading(false);
                setDropBox(false);
                // Handle errors
            }
        } catch (error) {
            notify('Error Occurred');
            console.error('An error occurred', error);
            setLoading(false);
            setDropBox(false);
            // Handle errors
        }
    };









    return (
        <>

            {/* Delete Alert */}

            <div
                class={`flex items-center fixed w-full justify-center gap-4 rounded-lg bg-red-200 px-6 z-50 py-2 text-base font-semibold text-red-700 transition duration-300 ease-in-out ${(onDelete) ? "top-0" : "-translate-y-full"}`}
            >

                <span>Are you sure you want to proceed with the deletion?</span><button
                    type="button"
                    class="inline-block rounded bg-red-700 px-4 p-2 text-sm font-medium uppercase leading-normal text-white"
                    onClick={(e) => {
                        e.preventDefault();
                        setOnDelete(false);
                        deleteNote(noteId);
                    }}
                >
                    YES
                </button>
                <button
                    type="button"
                    class="inline-block rounded bg-red-700 px-4 p-2 text-sm font-medium uppercase leading-normal text-white"
                    onClick={(e) => {
                        e.preventDefault();
                        setOnDelete(false);
                    }}>
                    NO
                </button>
            </div>



            {/* Notification System */}
            <div class={`fixed transition duration-500 ease-in-out top-0 border bg-purple-100 border-l-4 border-r-0 border-t-0 border-b-0 border-purple-500 text-purple-700 p-4 right-0 z-50 overflow-hidden ${(isNotified) ? "" : "translate-x-full"}`}>
                <p class="font-bold">{notification}</p>
            </div>


            {/* Navbar */}
            <nav
                class="relative flex w-full flex-wrap items-center justify-center font-semibold bg-[#FBFBFB] py-2 text-white-500 shadow-lg hover:text-neutral-700 bg-gray-800 focus:text-white-700 lg:py-4">
                <a class="text-xl text-white tracking-wider" href="/"
                >MemoMind </a>
            </nav>



            {/* Modals */}
            <div
                className={`fixed inset-0 w-full h-full transform transition-all duration-200 ease-in-out ${dropBox ? "bg-black bg-opacity-50 z-50" : "-z-50 opacity-0"
                    }`}>


                {/* Form Modal */}

                <div
                    class={`fixed top-0 left-0 z-[1055]  h-full w-full overflow-y-auto overflow-x-hidden outline-none`}
                >
                    <div class="pointer-events-none relative flex min-h-[calc(100%-1rem)] w-auto  items-center  min-[576px]:mx-auto min-[576px]:mt-7 min-[576px]:min-h-[calc(100%-3.5rem)] min-[576px]:max-w-[700px]">
                        <div class="pointer-events-auto relative flex w-full flex-col rounded-md border-none bg-white bg-clip-padding text-current shadow-lg outline-none">
                            <div class="flex flex-shrink-0 items-center justify-between rounded-t-md border-b-2 border-neutral-100 border-opacity-100 p-4">
                                <h5 class="text-xl font-medium leading-normal text-neutral-800">
                                    {head} Note
                                </h5>

                                <button
                                    type="button"
                                    class="box-content rounded-none border-none hover:no-underline hover:opacity-75 focus:opacity-100 focus:shadow-none focus:outline-none hover:text-red-800"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setDropBox(0);
                                        //   setEditBox(0);
                                    }}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke-width="1.5"
                                        stroke="currentColor"
                                        class="h-6 w-6"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            </div>
                            <div class="relative p-4">
                                <div class="p-6 space-y-6">
                                    <form>
                                        <div class="grid grid-cols-6 gap-6">
                                            <div class="col-span-full">
                                                <label class="text-sm font-medium text-gray-900 block mb-2">
                                                    Title
                                                </label>
                                                <input
                                                    value={title}
                                                    type="text"
                                                    class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                                                    placeholder="Adventure Awaits"
                                                    onChange={(e) => setTitle(e.target.value)}
                                                    required=""
                                                />
                                            </div>
                                            <div class="col-span-full">
                                                <label class="text-sm font-medium text-gray-900 block mb-2">
                                                    Tagline
                                                </label>
                                                <input
                                                    value={tagline}
                                                    type="text"
                                                    class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                                                    placeholder="Explore the uncharted territories and embrace the thrill of the unknown"
                                                    onChange={(e) => setTagline(e.target.value)}
                                                    required=""
                                                />
                                            </div>
                                            <div class="col-span-full">
                                                <label
                                                    for="product-details"
                                                    class="text-sm font-medium text-gray-900 block mb-2"
                                                >
                                                    Body
                                                </label>
                                                <textarea
                                                    value={body}
                                                    rows="6"
                                                    class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-4"
                                                    placeholder="Unleash the adventurer within as you zip line through dense forests, camp under the starlit skies, and share laughter and stories around the campfire with fellow travelers"
                                                    onChange={(e) => setBody(e.target.value)}
                                                ></textarea>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                            <div class="flex flex-shrink-0 flex-wrap items-center justify-end rounded-b-md border-t-2 border-neutral-100 border-opacity-100 p-4">
                                <button
                                    type="button"
                                    class="inline-block rounded bg-primary-100 px-6 pt-2.5 pb-2 text-xs font-medium uppercase leading-normal focus:outline-none focus:ring-0 hover:text-red-800"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setDropBox(0);
                                    }}
                                >
                                    Close
                                </button>
                                <div
                                    className="text-xs py-2 px-4 text-white font-medium rounded cursor-pointer uppercase flex gap-2 bg-sky-700"
                                    onClick={() => {
                                        if (head === "Add") {
                                            setLoading(true);
                                            handleSubmit();
                                        }
                                        else {
                                            setLoading(true);
                                            editNote(noteId);
                                        }
                                    }}
                                >
                                   {(loading)?<Spinner/>:""}{head}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>








            {/* Notes Main Body and Add Button*/}
            <div className='w-11/12 mx-auto'>
                <div className='text-4xl md:text-5xl lg:text-6xl font-semibold pt-8 pb-4 md:pt-12 md:pb-6 w-full flex justify-between items-center'><span>Notes</span><span className='z-40'>
                    <i class="fa-solid fa-plus bg-black text-white text-xl md:text-3xl p-6 rounded-full cursor-pointer transition duration-200 ease-in-out -rotate-90 hover:rotate-0" onClick={(e) => {
                        e.preventDefault();
                        setHead("Add");
                        setTitle("");
                        setTagline("");
                        setBody("");
                        setDropBox(true);
                    }}></i>
                </span></div>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full mx-auto py-8'>
                {(loading)?<Spinner/>:""}{notedata}
                </div>
            </div>




            {/* Pagination Buttons */}

            <div className="inline-flex -space-x-px text-sm w-full mx-auto flex justify-center gap-2">
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        className={`flex items-center justify-center px-3 h-8 leading-tight rounded-full border border-gray-300   ${currentPage === index + 1 ? 'active  bg-rose-600 text-white shadow-md' : 'hover:bg-gray-100 bg-white'}`}
                        key={index}
                        onClick={() => setCurrentPage(index + 1)}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>


            <footer className='w-full items-center flex justify-center bg-gray-800 h-6 relative mt-12 bottom-0'>
                    <div className='text-xs text-white font-semibold'>Made by Deepak</div>
            </footer>


        </>
    )
}

export default Cards
