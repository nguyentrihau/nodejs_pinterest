# nodejs_pinterest

----- users ------
 
 * Permission:
 - Có 5 bậc từ 0 - 4
  ++ 0: banned: chỉ có thể lấy thông tin, ko thể sửa, xóa
  ++ 1, 2: toàn quyền lấy, sửa, xóa thông tin của bản thân, ko dc sửa, xóa thông tin của người khác!
  ++ 3: Moderators: toàn quyền lấy, sửa, xóa thông tin của bản thân, dc ban user khác! 
  ++ 4: Admin: Toàn quyền, có thể sửa, xóa thông tin của thành viên khác.
  !!! Chỉ được ban thành viên có permission nhỏ hơn bản thân, ko dc ban bản thân!
  
 * Sign in: 
  - email: string
  - password: string
  
 * Sign up:
  - email: string
  - password: string
  - age: number
  - avatar: tự động lấy default

 * Get current info
 - Lấy thông tin của bản thân (chỉ cần truyền token)
 
 * Get info by id 
 - Lấy thông tin của người khác
 
 * 
 
