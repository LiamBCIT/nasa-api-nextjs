import axios from "axios";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function Polychromatic() {

    const [image, setImage] = useState([]);
    const [images, setImages] = useState([]);
    const [time, setTime] = useState("loading");
    const [date, setDate] = useState('');
    const [coords, setCoords] = useState({});

    const apiKey = "20A4ryjYJVNCptf2LDp46ahiFFe2Yyl2zPZMVOQd";
    const url = `https://epic.gsfc.nasa.gov/api/natural?&api_key=${apiKey}`;

    const getPolychromaticData = async () => {
        const res = await axios.get(url);
        const data = await res.data;
        console.log(data);

        const caption = data[0].caption;
        const date = data[0].date.split(" ")[0];
        const date_formatted = date.replaceAll('-', "/");

        let times = [];
        let images = []; 

        for(let i = 0; i < data.length; i++) { 
            let time = data[i].date.split(" ")[1]; 
            let coords = data[i].centroid_coordinates;
            let imageGrabbed = data[i].image;
            let image = `https://epic.gsfc.nasa.gov/archive/natural/${date_formatted}/png/${imageGrabbed}.png`;
            
            times.push(time);
            images.push({
                image: image,
                time: time,
                coords: coords
            })
        }


        setDate(date);
        setImages(images);
        
        setImage(images[0].image);
        setTime(times[0]);
        setCoords([images[0].coords.lat, images[0].coords.lon]);      

        console.log(image);


    }

    useEffect(() => {
        getPolychromaticData();
    }, []);

    return (
            <>
                <script src="../path/to/flowbite/dist/flowbite.min.js"></script>

                <div class="rounded-2xl p-4 text-white">  
                        <h2 text-lg>Polychromatic</h2>
                        <Image src={image} alt={image} width={200} height={200}></Image>
                        <div>{time}</div>
                        <div>{date}</div>
                        <div>{coords[0]}, {coords[1]}</div>
                </div>

                <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" class="px-6 py-3">Time</th>
                            <th scope="col" class="px-6 py-3">Latitude</th>
                            <th scope="col" class="px-6 py-3">Longitude</th>
                            <th scope="col" class="px-6 py-3">Image</th>
                            <th></th>
                        </tr>
                    </thead>               
                    <tbody>
                        {
                            images.map((e, i) => {
                                return (
                                    <tr key={i} class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                        <td class="px-6 py-4">{e.time}</td>
                                        <td class="px-6 py-4">{e.coords.lat}</td>
                                        <td class="px-6 py-4">{e.coords.lon}</td>
                                        <td class="px-6 py-4"><Image src={e.image} alt={i} width={200} height={200}></Image></td>
                                        <td>
                                            <button onClick={() => {
                                                setImage(e.image);
                                                setTime(e.time);
                                                setCoords([e.coords.lat, e.coords.lon]);
                                                console.log(images[i].image);
                                                document.body.scrollIntoView();
                                            }}>View</button>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
        </>
    )
}

