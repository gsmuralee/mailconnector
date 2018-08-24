@echo OFF

nssm install NodeReceiveMailDMS "%CD%/"mailReceiver.bat
nssm set NodeReceiveMailDMS AppDirectory "%CD%" 
nssm set NodeReceiveMailDMS Start SERVICE_AUTO_START
nssm set NodeReceiveMailDMS Type SERVICE_WIN32_OWN_PROCESS
	