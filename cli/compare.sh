#!/bin/bash

addSI() {
	if [ $1 -lt 1024 ]; then
		echo $1
	else
		local ks=`echo "scale=2; $1 / 1024" | bc`
		echo "$ks K"
	fi
}

filesize() {
	local s=`ls -l $1 | awk '{print $5}'`
	echo $(addSI $s)Bytes
}

bitrate() {
	local b=`ffprobe -v quiet -hide_banner -show_streams -show_entries stream=bit_rate -of default=noprint_wrappers=1 $1 | awk -F= 'NR==1{print $2}'`
	echo $(addSI $b)bps
}

bavc1=([180]=400 [360]=1040 [720]=2912)
bhvc1=([180]=280 [360]=728 [720]=2038)
bav01=([180]=200 [360]=520 [720]=1456)
savc1=$(filesize ".media/$1/.enc/avc1_${2}p.mp4")
shvc1=$(filesize ".media/$1/.enc/hvc1_${2}p.mp4")
sav01=$(filesize ".media/$1/.enc/av01_${2}p.mp4")
ravc1=$(bitrate ".media/$1/.enc/avc1_${2}p.mp4")
rhvc1=$(bitrate ".media/$1/.enc/hvc1_${2}p.mp4")
rav01=$(bitrate ".media/$1/.enc/av01_${2}p.mp4")
ffmpeg \
	-y \
	-i ".media/$1/.enc/avc1_${2}p.mp4" \
	-i ".media/$1/.enc/hvc1_${2}p.mp4" \
	-i ".media/$1/.enc/av01_${2}p.mp4" \
	-i ".media/$1/.enc/mp4a_256k.m4a" \
	-filter_complex " \
		[0:v][1:v][2:v] xstack=inputs=3:fill=black:layout=0_0|w0_0|0_h0 [v]; \
		[v] \
		drawtext=fontsize=28:fontcolor=white:x=10+w/2:y=h/2+10:text='AVC ${bavc1[$2]}k', \
		drawtext=fontsize=16:fontcolor=white:x=10+w/2:y=h/2+38:text='${savc1}', \
		drawtext=fontsize=16:fontcolor=white:x=10+w/2:y=h/2+54:text='${ravc1}', \
		drawtext=fontsize=28:fontcolor=white:x=10+w*3/4:y=h/2+10:text='HEVC ${bhvc1[$2]}k', \
		drawtext=fontsize=16:fontcolor=white:x=10+w*3/4:y=h/2+38:text='${shvc1}', \
		drawtext=fontsize=16:fontcolor=white:x=10+w*3/4:y=h/2+54:text='${rhvc1}', \
		drawtext=fontsize=28:fontcolor=white:x=10+w/2:y=h*3/4+10:text='AV1 ${bav01[$2]}k', \
		drawtext=fontsize=16:fontcolor=white:x=10+w/2:y=h*3/4+38:text='${sav01}', \
		drawtext=fontsize=16:fontcolor=white:x=10+w/2:y=h*3/4+54:text='${rav01}' \
	" \
	-vcodec libx264 -profile:v high -preset slow -crf 20 \
	-acodec copy \
	".media/$1/.enc/cmpr_${2}p.mp4"
