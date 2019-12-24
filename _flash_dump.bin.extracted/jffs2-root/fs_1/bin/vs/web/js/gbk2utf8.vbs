' VB Script Document
Public Function VBURLEncoding(vstrIn)
Dim i
    strReturn = ""
    For i = 1 To Len(vstrIn)
        ThisChr = Mid(vStrIn,i,1)
        If Abs(Asc(ThisChr)) < &HFF Then
            strReturn = strReturn & ThisChr
        Else
            innerCode = Asc(ThisChr)
            If innerCode < 0 Then
                innerCode = innerCode + &H10000
            End If
            Hight8 = (innerCode  And &HFF00)\ &HFF
            Low8 = innerCode And &HFF
            strReturn = strReturn & "%" & Hex(Hight8) &  "%" & Hex(Low8)
        End If
    Next
    VBURLEncoding = strReturn
End Function

Public Function URLDecode(strURL)
Dim I
 
If InStr(strURL, "%") = 0 Then URLDecode = strURL: Exit Function
 
For I = 1 To Len(strURL)
    If Mid(strURL, I, 1) = "%" Then
       If eval("&H" & Mid(strURL, I + 1, 2)) > 127 Then
          URLDecode = URLDecode & Chr(eval("&H" & Mid(strURL, I + 1, 2) & Mid(strURL, I + 4, 2)))
          I = I + 5
       Else
          URLDecode = URLDecode & Chr(eval("&H" & Mid(strURL, I + 1, 2)))
          I = I + 2
       End If
    Else
       URLDecode = URLDecode & Mid(strURL, I, 1)
    End If
Next
End Function 