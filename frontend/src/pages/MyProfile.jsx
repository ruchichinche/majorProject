import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
const MyProfile = () => {
    const { userData, updateUserProfile } = useContext(AppContext);
    console.log('MyProfile context', { userData, hasUpdateFn: typeof updateUserProfile === 'function' });
    const [isEdit, setEdit] = useState(false);
    const [form, setForm] = useState({});
    const [file, setFile] = useState(null);
    useEffect(() => {
        if (userData) setForm(userData);
    }, [userData]);

    const handleChange = (key, value) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const handleAddressChange = (key, value) => {
        setForm((prev) => ({ ...prev, address: { ...(prev.address || {}), [key]: value } }));
    };

    const handleSave = async () => {
        // if there's a file selected, use FormData
        let res;
        if (file) {
            const fd = new FormData();
            if (form.name) fd.append('name', form.name);
            if (form.phone) fd.append('phone', form.phone);
            if (form.address) fd.append('address', JSON.stringify(form.address));
            if (form.dob) fd.append('dob', form.dob);
            if (form.gender) fd.append('gender', form.gender);
            fd.append('image', file);
            res = await updateUserProfile(fd);
        } else {
            const payload = {
                name: form.name,
                phone: form.phone,
                address: JSON.stringify(form.address || {}),
                dob: form.dob,
                gender: form.gender,
            };
            res = await updateUserProfile(payload);
        }

        if (res && res.success) setEdit(false);
    };

    if (!userData) return <div>Loading...</div>;

    return (
        <div className="max-w-lg  flex flex-col gap-2 text-sm">
             {
                isEdit ? (
                    <div>
                        <img className="w-36 rounded border border-black" src={file ? URL.createObjectURL(file) : (form.image || assets.upload_icon)} alt="" />
                        <div className="mt-2">
                            <label className="text-sm">Profile image</label>
                            <input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} />
                        </div>
                    </div>
                ) : (
                    <img className="w-36  rounded border border-black" src={form.image || assets.upload_icon} alt="" />
                )
            } 
            {
                isEdit
                    ? <input className="bg-gray-50 text-3xl font-medium max-w-60 mt-4  " type="text" value={form.name || ''} onChange={e => handleChange('name', e.target.value)} />
                    : <p className="font-medium  text-3xl text-neutral-800 mt-4">{form.name}</p>
            }
            {/* {
                isEdit && (
                    <div className="mt-2">
                        <label className="text-sm">Profile image</label>
                        <input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} />
                    </div>
                )
            } */}
            <hr className="bg-zinc-400 h-[1px border-none]" />
            <div>
                <p className="text-neutral-500 underline mt-3">CONTACT INFORMATION</p>
                <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700">
                    <p className="font-medium">Email id:</p>
                    <p className="text-blue-500">{form.email}</p>
                    <p className="font-medium">Phone:</p>
                    {
                        isEdit
                            ? <input className="bg-gray-100 max-w-52 " type="text" value={form.phone || ''} onChange={e => handleChange('phone', e.target.value)} />
                            : <p className="text-blue-400">{form.phone}</p>
                    }
                    <p>Address:</p>
                    {
                        isEdit
                            ? <p>
                                <input onChange={(e) => handleAddressChange('line1', e.target.value)} value={form.address?.line1 || ''} type="text" />
                                <br />
                                <input onChange={(e) => handleAddressChange('line2', e.target.value)} value={form.address?.line2 || ''} type="text" />
                            </p>
                            : <p>
                                {form.address?.line1}
                                <br />
                                {form.address?.line2}
                            </p>
                    }
                </div>
                <p className="text-neutral-500 underline mt-3">BASIC INFORMATIONS</p>
                <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700">
                    <p>Gender:</p>
                    {
                        isEdit
                            ? <select className="max-w-20 bg-gray-100 " onChange={(e) => handleChange('gender', e.target.value)} value={form.gender}>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="others">others</option>
                            </select>
                            : <p className="text-gray-400">{form.gender}</p>
                    }
                    <p className="font-medium ">Birthday:</p>
                    {
                        isEdit ? <input className="max-w-28 bg-gray-400" type="date" onChange={(e) => handleChange('dob', e.target.value)} value={form.dob || ''} />
                            : <p className="text-gray-400">{form.dob}</p>
                    }
                </div>
                <br />
                <div>
                    {
                        isEdit
                            ? <button className="border border-primaary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all" onClick={handleSave}>Save information</button>
                            : <button className="border border-primaary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all" onClick={() => setEdit(true)}>Edit</button>
                    }
                </div>
            </div>
        </div>
    )
}

export default MyProfile;