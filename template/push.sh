#!/bin/bash

dir='/home/www/portal-admin'

ssh portal "rm -rf ${dir}/*"

scp -r dist/* portal:$dir