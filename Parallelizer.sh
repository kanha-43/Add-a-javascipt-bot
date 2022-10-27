#!/bin/bash

kar='KAR5'
runList='run2 run3 run4'
mkdir normFunc
for run in $runList
do 
  fsl5.0-flirt -in $kar"deformed.nii.gz" -ref normtemp.nii.gz -omat $run".norm1.mat" -bins 256 -cost corratio -searchrx -90 90 -searchry -90 90 -searchrz -90 90 -dof 12 
  fsl5.0-flirt -in $run".poststats.nii.gz" -ref $kar"deformed.nii.gz" -omat $run".norm2.mat" -bins 256 -cost corratio -searchrx -90 90 -searchry -90 90 -searchrz -90 90 -dof 12 
  fsl5.0-convert_xfm -concat $run".norm1.mat" -omat $run".norm.mat" $run".norm2.mat"
  fsl5.0-flirt -in $run".poststats.nii.gz" -ref normtemp.nii.gz -out $PWD/normFunc/$run".norm.nii.gz" -applyxfm -init $run".norm.mat" -interp trilinear

  rm -f *.mat
done