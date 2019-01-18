!macro customInstall
  DetailPrint "Register pyrexcoin URI Handler"
  DeleteRegKey HKCR "pyrexcoin"
  WriteRegStr HKCR "pyrexcoin" "" "URL:pyrexcoin"
  WriteRegStr HKCR "pyrexcoin" "URL Protocol" ""
  WriteRegStr HKCR "pyrexcoin\DefaultIcon" "" "$INSTDIR\${APP_EXECUTABLE_FILENAME}"
  WriteRegStr HKCR "pyrexcoin\shell" "" ""
  WriteRegStr HKCR "pyrexcoin\shell\Open" "" ""
  WriteRegStr HKCR "pyrexcoin\shell\Open\command" "" "$INSTDIR\${APP_EXECUTABLE_FILENAME} %1"
!macroend