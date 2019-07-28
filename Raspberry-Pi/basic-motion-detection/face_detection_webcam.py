import face_recognition

image = None
face_locations = face_recognition.face_locations(image)

print(f'there are {len(face_locations)} people in view')


# import the necessary packages
import datetime
from picamera.array import PiRGBArray
from picamera import PiCamera
from imutils.video import VideoStream
import datetime
import imutils
import time
import cv2

# video capturing
count = 0
frame_width = 640
frame_height = 480

# if the video argument is None, then we are reading from webcam
print("Using raspi camera...")
# initialize the camera and grab a reference to the raw camera capture
camera = PiCamera()
camera.resolution = (frame_width, frame_height)
#camera.framerate = 32
rawCapture = PiRGBArray(camera, size=(frame_width, frame_height))
time.sleep(2.0)


# initialize the first frame in the video stream
firstFrame = None


print("[+] Starting security camera...")
for frame in camera.capture_continuous(rawCapture, format="bgr", use_video_port=True):
	rawCapture.truncate(0)

	# grab the current frame and initialize the occupied/unoccupied text
	frame = frame.array
	frame = frame if args.get("video", None) is None else frame[1]

	# if the frame could not be grabbed, then we have reached the end
	# of the video
	if frame is None:
		break

	# resize the frame, 
	#frame = imutils.resize(frame, width=500)
	# convert it to grayscale, and blur it
	gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
	gray = cv2.GaussianBlur(gray, (21, 21), 0)

	# if the first frame is None, initialize it
	if firstFrame is None:
		firstFrame = gray
		continue

	# compute the absolute difference between the current frame and
	# first frame
	frameDelta = cv2.absdiff(firstFrame, gray)
	thresh = cv2.threshold(frameDelta, 50, 255, cv2.THRESH_BINARY)[1]

	# dilate the thresholded image to fill in holes, then find contours
	# on thresholded image
	thresh = cv2.dilate(thresh, None, iterations=2)
	cnts = cv2.findContours(thresh.copy(), cv2.RETR_EXTERNAL,
		cv2.CHAIN_APPROX_SIMPLE)
	cnts = imutils.grab_contours(cnts)

	# loop over the contours
	for c in cnts:
		# if the contour is too small, ignore it
		if cv2.contourArea(c) < args["min_area"]:
			continue

		# compute the bounding box for the contour, draw it on the frame,
		# and update the text
		(x, y, w, h) = cv2.boundingRect(c)
		cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)
		text = "Occupied"

	# draw the text and timestamp on the frame
	cv2.putText(frame, "Room Status: {}".format(text), (10, 20),
		cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 2)
	cv2.putText(frame, datetime.datetime.now().strftime("%A %d %B %Y %I:%M:%S%p"),
		(10, frame.shape[0] - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.35, (0, 0, 255), 1)

	# show the frame and record if the user presses a key
	#cv2.imshow("Security Feed", frame)
	#cv2.imshow("Thresh", thresh)
	#cv2.imshow("Frame Delta", frameDelta)
	key = cv2.waitKey(1) & 0xFF

	# indicate if their is a change in room status in the console
	if text != previousText:
		dt = '{date:%Y-%m-%d_%H:%M:%S}'.format( date=datetime.datetime.now() )
		print("%s Current Status: %s" % (dt, text))
		if text == "Occupied":	
			# Define the codec and create VideoWriter object
			video_name = 'videos/recording_%s.avi' % count
			print("Recording video to: %s" % video_name)
			# Define the codec and create VideoWriter object
			out = cv2.VideoWriter(video_name, cv2.VideoWriter_fourcc('M','J','P','G'), 20.0, (frame_width,frame_height))
			count += 1
		else:
			out.release()
			out = None

	# writing the frame if the current status is occupied
	if text == "Occupied" and out is not None:
		#frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
		out.write(frame)

	# setting to only display status upon change
	previousText = text
	
	# if the `q` key is pressed, break from the lop
	if key == ord("q"):
		break
	if key == ord("r"):
		firstFrame = None
		print("Reset first frame!")

# cleanup the camera and close any open windows
out.release() # releasing recording
vs.stop() if args.get("video", None) is None else vs.release()
cv2.destroyAllWindows()
print("[-] Exit of video feed complete")