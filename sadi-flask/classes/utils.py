
import cv2 as cv

def get_available_camera_details():
    """
    Get the details of all available cameras
    """
    # Get the list of available camera indexes
    camera_indexes = list(range(0, 10))
    camera_details = []

    for index in camera_indexes:
        # Try to open the camera with DirectShow backend
        capture = cv.VideoCapture(index, cv.CAP_DSHOW)
        if capture.isOpened():
            # Read camera ID and label
            capture.set(cv.CAP_PROP_POS_MSEC, 0)
            ret, frame = capture.read()
            if ret:
                camera_size = f"{frame.shape[1]}x{frame.shape[0]}"
            else:
                camera_size = "Unknown"

            # Store camera details
            camera_info = {
                'index': index,
                'camera_size': camera_size,
            }
            camera_details.append(camera_info)

            # Release the camera capture
            capture.release()

    return camera_details


# sample to run get_available_camera_details
# details = get_camera_details()

# # Print the camera details
# for camera_info in details:
#     print(f"Camera Index: {camera_info['index']}")
#     print(f"Camera Size: {camera_info['camera_size']}")
#     # print(f"Camera Label: {camera_info['label']}")
#     print()



