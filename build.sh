# build NeonX2.0 ./build.sh

coffeeBuild=("./NeonX/sys/explorer")
typescriptBuild=("./NeonX/sys/desktop" "./NeonX/sys/screensaver" "./NeonX/sys/script"
		"./NeonX/sys/login" "./applications/Notepad/script" "./applications/Calender/script"
		"./applications/PDF Viewer/script")

# build coffeescript files
for c in ${coffeeBuild[@]}; do
		rm $c.js
		coffee -c $c.coffee
done

# build typescript files
for t in ${typescriptBuild[@]}; do
		rm $t.js
		tsc $t.ts
done
