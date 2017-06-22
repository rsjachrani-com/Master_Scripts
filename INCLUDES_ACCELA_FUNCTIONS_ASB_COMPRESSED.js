/*------------------------------------------------------------------------------------------------------/
| Program : INCLUDES_ACCELA_FUNCTIONS_ASB.js
| Event   : N/A
|
| Usage   : Accela Inc. Developed Master Script Functions.  This file should not be modified.  For custom
			includes make additions and overrides to the INCLUDES_CUSTOM script file.
|
| Notes   : These functions are only available to the Application Submit Before master script
|
/------------------------------------------------------------------------------------------------------*/

// Compressed Version

function getContactArrayBefore(){var e=aa.env.getValue("ContactList");var t=e.toArray();var n=new Array;if(t){for(yy in t){var r=new Array;r["lastName"]=t[yy].getPeople().lastName;r["refSeqNumber"]=t[yy].getRefContactNumber();r["firstName"]=t[yy].getPeople().firstName;r["middleName"]=t[yy].getPeople().middleName;r["businessName"]=t[yy].getPeople().businessName;r["contactSeqNumber"]=t[yy].getPeople().contactSeqNumber;r["contactType"]=t[yy].getPeople().contactType;r["relation"]=t[yy].getPeople().relation;r["phone1"]=t[yy].getPeople().phone1;r["phone2"]=t[yy].getPeople().phone2;r["email"]=t[yy].getPeople().email;r["addressLine1"]=t[yy].getPeople().getCompactAddress().getAddressLine1();r["addressLine2"]=t[yy].getPeople().getCompactAddress().getAddressLine2();r["city"]=t[yy].getPeople().getCompactAddress().getCity();r["state"]=t[yy].getPeople().getCompactAddress().getState();r["zip"]=t[yy].getPeople().getCompactAddress().getZip();r["fax"]=t[yy].getPeople().fax;r["notes"]=t[yy].getPeople().notes;r["country"]=t[yy].getPeople().getCompactAddress().getCountry();r["fullName"]=t[yy].getPeople().fullName;var i=t[yy].getPeople().getAttributes().toArray();for(xx1 in i)r[i[xx1].attributeName]=i[xx1].attributeValue;n.push(r)}}return n}function getCSLBInfoBefore(){var e=aa.env.getValue("CAEValidatedNumber");if(e==""||e==null)return true;var t=aa.util.httpPost("http://www2.cslb.ca.gov/IVR/License+Detail.asp?LicNum="+e,"");if(t.getSuccess())var n=t.getOutput();else{logDebug("**ERROR: communicating with CSLB: "+t.getErrorMessage());return false}if(n.indexOf("<Error>")>0){logDebug("**ERROR: CSLB information returned an error: "+getNode(getNode(n,"License"),"**ERROR"));return false}var r=getNode(n,"BusinessInfo");var i=getNode(n,"PrimaryStatus");var s=getNode(n,"Classifications");var o=getNode(n,"ContractorBond");var u=getNode(n,"WorkersComp");var a=new Date(getNode(r,"ExpireDt"));if(a<startDate){showMessage=true;comment("**WARNING: Professional License expired on "+a.toString())}}function getGISBufferInfo(e,t,n){var r="feet";var i=new Array;var s=aa.gis.getGISType(e,t);if(s.getSuccess()){var o=s.getOutput();for(argnum=3;argnum<arguments.length;argnum++)o.addAttributeName(arguments[argnum])}else{logDebug("**ERROR: Getting GIS Type for Buffer Target.  Reason is: "+s.getErrorType()+":"+s.getErrorMessage());return false}var u=aa.gis.getParcelGISObjects(ParcelValidatedNumber);if(u.getSuccess())var a=u.getOutput();else{logDebug("**ERROR: Getting GIS objects for Parcel.  Reason is: "+u.getErrorType()+":"+u.getErrorMessage());return false}for(a1 in a){var f=aa.gis.getBufferByRadius(a[a1],n,r,o);if(f.getSuccess())var l=f.getOutput();else{aa.print("**ERROR: Retrieving Buffer Check Results.  Reason is: "+f.getErrorType()+":"+f.getErrorMessage());return false}for(a2 in l){var c=l[a2].getGISObjects();for(z1 in c){var h=c[z1].getAttributeNames();var p=c[z1].getAttributeValues();var d=new Array;d["GIS_ID"]=c[z1].getGisId();for(n1 in h){d[h[n1]]=p[n1]}i.push(d)}}}return i}function getGISInfo(e,t,n){var r="feet";var i;var s=aa.gis.getGISType(e,t);if(s.getSuccess()){var o=s.getOutput();o.addAttributeName(n)}else{logDebug("**ERROR: Getting GIS Type for Buffer Target.  Reason is: "+s.getErrorType()+":"+s.getErrorMessage());return false}var u=aa.gis.getParcelGISObjects(ParcelValidatedNumber);if(u.getSuccess())var a=u.getOutput();else{logDebug("**ERROR: Getting GIS objects for Parcel.  Reason is: "+u.getErrorType()+":"+u.getErrorMessage());return false}for(a1 in a){var f=aa.gis.getBufferByRadius(a[a1],"0",r,o);if(f.getSuccess())var l=f.getOutput();else{logDebug("**ERROR: Retrieving Buffer Check Results.  Reason is: "+f.getErrorType()+":"+f.getErrorMessage());return false}for(a2 in l){var c=l[a2].getGISObjects();for(z1 in c){var h=c[z1].getAttributeValues();i=h[0]}}}return i}function getRelatedCapsByAddressBefore(e){var t=new Array;if(AddressValidatedNumber>0){addObj=aa.address.getRefAddressByPK(parseInt(AddressValidatedNumber)).getOutput();AddressStreetName=addObj.getStreetName();AddressHouseNumber=addObj.getHouseNumberStart();AddressStreetSuffix=addObj.getStreetSuffix();AddressZip=addObj.getZip();AddressStreetDirection=addObj.getStreetDirection()}if(AddressStreetDirection=="")AddressStreetDirection=null;if(AddressHouseNumber=="")AddressHouseNumber=0;if(AddressStreetSuffix=="")AddressStreetSuffix=null;if(AddressZip=="")AddressZip=null;capAddResult=aa.cap.getCapListByDetailAddress(AddressStreetName,parseInt(AddressHouseNumber),AddressStreetSuffix,AddressZip,AddressStreetDirection,null);if(capAddResult.getSuccess()){var n=capAddResult.getOutput()}else{logDebug("**ERROR: getting similar addresses: "+capAddResult.getErrorMessage());return false}for(cappy in n){relcap=aa.cap.getCap(n[cappy].getCapID()).getOutput();reltype=relcap.getCapType().toString();var r=true;var i=e.split("/");if(i.length!=4)logDebug("**ERROR: The following Application Type String is incorrectly formatted: "+e);else for(xx in i)if(!i[xx].equals(appTypeArray[xx])&&!i[xx].equals("*"))r=false;if(r)t.push(n[cappy])}if(t.length>0)return t}function getRelatedCapsByParcelBefore(e){var t=new Array;var n=aa.cap.getCapListByParcelID(ParcelValidatedNumber,null);if(n.getSuccess()){var r=n.getOutput()}else{logDebug("**ERROR: getting similar parcels: "+n.getErrorMessage());return false}for(cappy in r){var i=aa.cap.getCap(r[cappy].getCapID()).getOutput();var s=i.getCapType().toString().split("/");var o=true;var u=e.split("/");if(u.length!=4)logDebug("**ERROR: The following Application Type String is incorrectly formatted: "+e);else for(xx in u)if(!u[xx].equals(s[xx])&&!u[xx].equals("*"))o=false;if(o)t.push(r[cappy])}if(t.length>0)return t}function loadAppSpecificBefore(e){for(loopk in AppSpecificInfoModels){if(useAppSpecificGroupName){e[AppSpecificInfoModels[loopk].getCheckboxType()+"."+AppSpecificInfoModels[loopk].checkboxDesc]=AppSpecificInfoModels[loopk].checklistComment;logDebug("{"+AppSpecificInfoModels[loopk].getCheckboxType()+"."+AppSpecificInfoModels[loopk].checkboxDesc+"} = "+AppSpecificInfoModels[loopk].checklistComment)}else{e[AppSpecificInfoModels[loopk].checkboxDesc]=AppSpecificInfoModels[loopk].checklistComment;logDebug("{"+AppSpecificInfoModels[loopk].checkboxDesc+"} = "+AppSpecificInfoModels[loopk].checklistComment)}}}function loadASITablesBefore(){var gm=aa.env.getValue("AppSpecificTableGroupModel");var ta=gm.getTablesMap().values();var tai=ta.iterator();while(tai.hasNext()){var tsm=tai.next();if(tsm.rowIndex.isEmpty())continue;var tempObject=new Array;var tempArray=new Array;var tn=tsm.getTableName();tn=String(tn).replace(/[^a-zA-Z0-9]+/g,"");if(!isNaN(tn.substring(0,1)))tn="TBL"+tn;var tsmfldi=tsm.getTableField().iterator();var tsmcoli=tsm.getColumns().iterator();var numrows=1;while(tsmfldi.hasNext()){if(!tsmcoli.hasNext()){var tsmcoli=tsm.getColumns().iterator();tempArray.push(tempObject);var tempObject=new Array;numrows++}var tcol=tsmcoli.next();var tval=tsmfldi.next();tempObject[tcol.getColumnName()]=tval}tempArray.push(tempObject);var copyStr=""+tn+" = tempArray";logDebug("ASI Table Array : "+tn+" ("+numrows+" Rows)");eval(copyStr)}}function loadASITables(){var gm=aa.env.getValue("AppSpecificTableGroupModel");var ta=gm.getTablesMap().values();var tai=ta.iterator();while(tai.hasNext()){var tsm=tai.next();if(tsm.rowIndex.isEmpty())continue;var tempObject=new Array;var tempArray=new Array;var tn=tsm.getTableName();tn=String(tn).replace(/[^a-zA-Z0-9]+/g,"");if(!isNaN(tn.substring(0,1)))tn="TBL"+tn;var tsmfldi=tsm.getTableField().iterator();var tsmcoli=tsm.getColumns().iterator();var numrows=1;while(tsmfldi.hasNext()){if(!tsmcoli.hasNext()){var tsmcoli=tsm.getColumns().iterator();tempArray.push(tempObject);var tempObject=new Array;numrows++}var tcol=tsmcoli.next();var tval=tsmfldi.next();tempObject[tcol.getColumnName()]=tval}tempArray.push(tempObject);var copyStr=""+tn+" = tempArray";logDebug("ASI Table Array : "+tn+" ("+numrows+" Rows)");eval(copyStr)}}function loadParcelAttributes(e){var t=capId;if(arguments.length==2)t=arguments[1];var n=null;var r=aa.parcel.getParcelandAttribute(t,null);if(r.getSuccess())var n=r.getOutput().toArray();else logDebug("**ERROR: Failed to get Parcel object: "+r.getErrorType()+":"+r.getErrorMessage());for(i in n){parcelArea+=n[i].getParcelArea();parcelAttrObj=n[i].getParcelAttribute().toArray();for(z in parcelAttrObj)e["ParcelAttribute."+parcelAttrObj[z].getB1AttributeName()]=parcelAttrObj[z].getB1AttributeValue();e["ParcelAttribute.Block"]=n[i].getBlock();e["ParcelAttribute.Book"]=n[i].getBook();e["ParcelAttribute.CensusTract"]=n[i].getCensusTract();e["ParcelAttribute.CouncilDistrict"]=n[i].getCouncilDistrict();e["ParcelAttribute.ExemptValue"]=n[i].getExemptValue();e["ParcelAttribute.ImprovedValue"]=n[i].getImprovedValue();e["ParcelAttribute.InspectionDistrict"]=n[i].getInspectionDistrict();e["ParcelAttribute.LandValue"]=n[i].getLandValue();e["ParcelAttribute.LegalDesc"]=n[i].getLegalDesc();e["ParcelAttribute.Lot"]=n[i].getLot();e["ParcelAttribute.MapNo"]=n[i].getMapNo();e["ParcelAttribute.MapRef"]=n[i].getMapRef();e["ParcelAttribute.ParcelStatus"]=n[i].getParcelStatus();e["ParcelAttribute.SupervisorDistrict"]=n[i].getSupervisorDistrict();e["ParcelAttribute.Tract"]=n[i].getTract();e["ParcelAttribute.PlanArea"]=n[i].getPlanArea()}}function proximity(e,t,n){var r="feet";if(arguments.length==4)r=arguments[3];bufferTargetResult=aa.gis.getGISType(e,t);if(bufferTargetResult.getSuccess()){buf=bufferTargetResult.getOutput();buf.addAttributeName(t+"_ID")}else{logDebug("**ERROR: Getting GIS Type for Buffer Target.  Reason is: "+bufferTargetResult.getErrorType()+":"+bufferTargetResult.getErrorMessage());return false}var i=aa.gis.getParcelGISObjects(ParcelValidatedNumber);if(i.getSuccess())var s=i.getOutput();else{logDebug("**ERROR: Getting GIS objects for Parcel.  Reason is: "+i.getErrorType()+":"+i.getErrorMessage());return false}for(a1 in s){var o=aa.gis.getBufferByRadius(s[a1],n,r,buf);if(o.getSuccess())var u=o.getOutput();else{logDebug("**ERROR: Retrieving Buffer Check Results.  Reason is: "+o.getErrorType()+":"+o.getErrorMessage());return false}for(a2 in u){proxObj=u[a2].getGISObjects();if(proxObj.length){return true}}}}function proximityToAttribute(e,t,n,r,i,s){var o=aa.gis.getGISType(e,t);if(o.getSuccess()){buf=o.getOutput();buf.addAttributeName(i)}else{logDebug("**ERROR: Getting GIS Type for Buffer Target.  Reason is: "+o.getErrorType()+":"+o.getErrorMessage());return false}var u=aa.gis.getParcelGISObjects(ParcelValidatedNumber);if(u.getSuccess())var a=u.getOutput();else{logDebug("**ERROR: Getting GIS objects for Parcel.  Reason is: "+u.getErrorType()+":"+u.getErrorMessage());return false}for(a1 in a){var f=aa.gis.getBufferByRadius(a[a1],n,r,buf);if(f.getSuccess())var l=f.getOutput();else{logDebug("**ERROR: Retrieving Buffer Check Results.  Reason is: "+f.getErrorType()+":"+f.getErrorMessage());return false}for(a2 in l){var c=l[a2].getGISObjects();for(z1 in c){var h=c[z1].getAttributeValues();retString=h[0];if(retString&&retString.equals(s))return true}}}}