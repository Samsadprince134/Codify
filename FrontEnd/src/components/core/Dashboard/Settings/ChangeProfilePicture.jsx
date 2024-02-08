import { useEffect, useRef, useState } from "react"
import { FiUpload } from "react-icons/fi"
import { useDispatch, useSelector } from "react-redux"

import { updateDisplayPicture } from "../../../services/operations/SettingsAPI"
import Iconbtn from "../../../common/Iconbtn"

export default function ChangeProfilePicture() {
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)
  const dispatch = useDispatch()

  const [loading, setLoading] = useState(false)
  const [imageurl, setImageUrl] = useState(null)
  const [previewSource, setPreviewSource] = useState(null)
  const [viewImage , setviewimage] = useState(false);

  const fileInputRef = useRef(null)

  const handleClick = () => {
    fileInputRef.current.click()
  }

  const handleFileChange = (e) => {
    console.log("event target file" , e.target.files[0])
    const file = e.target.files[0]
    // console.log(file)
    if (file) {
      setImageUrl(file)
      previewFile(file)
    }
  }

  const previewFile = (file) => {
    const reader = new FileReader()

    reader.readAsDataURL(file)
    console.log("reader", reader)
    reader.onloadend = () => {
      setPreviewSource(reader.result)
    }
  }

  const handleFileUpload = () => {
    try {
      console.log("uploading...")
      setLoading(true)
      const formData = new FormData()
      formData.append("imageurl", imageurl)
      // console.log("formdata", formData)
      dispatch(updateDisplayPicture(token, formData)).then(() => {
        setLoading(false)
      })
    } catch (error) {
      console.log("ERROR MESSAGE - ", error.message)
    }
  }
  function viewHandler(){
    setviewimage(!viewImage);
  }

  useEffect(() => {
    if (imageurl) {
      previewFile(imageurl)
    }
  }, [imageurl])
  return (
    <>
      <div className="flex items-center justify-between rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12 text-richblack-5">
        <div className="flex items-center gap-x-4">
        <div>
          <img onClick={viewHandler}
            src={previewSource || user?.image}
            alt={`profile-${user?.firstName}`}
            className="aspect-square w-[78px] rounded-full object-cover"
          />
        
          </div>
          <div className="space-y-2">
            <p>Change Profile Picture</p>
            <div className="flex flex-row gap-3">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/png, image/gif, image/jpeg"
              />
              <button
                onClick={handleClick}
                disabled={loading}
                className="cursor-pointer rounded-md bg-richblack-700 py-2 px-5 font-semibold text-richblack-50"
              >
                Select
              </button>
              <Iconbtn
                text={loading ? "Saving..." : "Save"}
                onclick={handleFileUpload}
              >
                {!loading && (
                  <FiUpload className="text-lg text-richblack-900" />
                )}
              </Iconbtn>
            </div>
          </div>
        </div>
        {
          viewImage && 
          
             ( <div  className="flex  justify-center items-center fixed  inset-0 bg-richblack-100 bg-opacity-10 backdrop-blur-sm ">
                    <img onClick={viewHandler}
                  src={previewSource || user?.image}
                  alt={`profile-${user?.firstName}`}
                  className="aspect-square w-[25%] rounded-full object-cover "
                />
                   
              </div>
             )
          
        }
      </div>
    </>
  )
}