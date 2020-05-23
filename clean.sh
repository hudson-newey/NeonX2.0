# clean up files before push
# or to debug
# or just make it look pretty :)
jsFiles=("./NeonX/sys/desktop" "./NeonX/sys/screensaver" "./NeonX/sys/script" "./NeonX/sys/login" "./NeonX/sys/explorer" "./applications/Notepad/script")

for i in ${jsFiles[@]}; do
    rm $i.js
done
echo "Done!"
