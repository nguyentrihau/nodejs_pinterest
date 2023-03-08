# nodejs_pinterest
------------------------------------- APi users --------------------------------------------

-- Permission:
+ Có 5 bậc từ 0 - 4 + 0: banned: chỉ có thể lấy thông tin, ko thể sửa, xóa 
+ 1, 2: toàn quyền lấy, sửa, xóa thông tin của bản thân, ko dc sửa, xóa thông tin của người khác! 
+ + 3: Moderators: toàn quyền lấy, sửa, xóa thông tin của bản thân, dc ban user khác! 
+ + 4: Admin: Toàn quyền, có thể sửa, xóa thông tin của thành viên khác. 
+ !!! Chỉ được ban thành viên có permission nhỏ hơn bản thân, ko dc ban bản thân!

-- Sign in:
+ email: string
+ password: string

-- Sign up:
+ email: string
+ password: string
+ age: number
+ avatar: tự động lấy default

----- Get current info ----------
+ Lấy thông tin của bản thân (chỉ cần truyền token) 

---- Get info by id(getUserInfo) ----
+ Lấy thông tin của người khác 

---- GetAllUser ----
+ Lấy thông tin của tất cả người dùng

---- avatarUpload ----
+ Cập nhật lại avatar của chính mình
+ Truyền vào token và form-data với key là avatar(file),value là chọn file hình ảnh

---- deleteUser ----
+ Xóa user theo params user_id
+ Chỉ ADMIN mới có quyền xóa

---- setPermission ----
+ truyền vào token và body:
  + users_id:number
  + permission_value:number
+ chỉ có ADMIN mới phân quyền được

---- banUser ----
+ Truyền vào token và params user_id
+ ADMIN -> MODE -> Member

---- unBanUser ----
+ Truyền vào token và params user_id
+ ADMIN -> MODE -> Member

---- deleteAvatar ----
+  Truyền vào Token và form-data
+ Xóa avatar bản thân, xóa xong sẽ trở về defaultAvatar

---- updateUser ----
+ Truyền vào Token và body(form-data):
  + age:number
  + user_name:string
  + avatar: file image
  
----------------------------------- API img ----------------------------

---- getAllImg ----
+ Ai cũng có thể lấy và nhìn thấy tất cả (không cần token)

---- getImgID ----
+ Kiếm ảnh theo img_id của ảnh
+ Truyền vào token và params id ảnh cần tìm

---- imgUpload ----
+ Đăng hình ảnh lên bằng form-data:
    + Truyền vào token(Người dùng đang đăng nhập đăng ảnh lên)
    + imgUpload: file hình ảnh
    + img_name:string 
  - Giảm dung lượng ảnh đăng lên bằng sharp
  - check image đăng lên tối đã 6mb
  
---- deleteImg ----
+ Chỉ có admin được quyền xóa ảnh:
    + Truyền vào token và params img_id muốn xóa
 
---- getImgByUserId ----
+ Tìm ảnh theo user_id :
    + Truyền vào params :user_id
    + Ai cũng có thể tìm và nhìn thấy hình ảnh của người cần tìm

---- getImgByName ----
+ Tìm ảnh theo tên hình ảnh:
    + Truyền vào query : keyword = (tên muốn tìm) 
    + Ai cũng có thể tìm hình ảnh theo tên

---- imgUpdate ----
+ Cập nhật hình ảnh của mình theo img_id:
    + Truyền vào token và form-data: - img_name:string
                                     - imgUpdate:file hình ảnh

----------------------------------- comment ---------------------------------

---- postComment
    
     
